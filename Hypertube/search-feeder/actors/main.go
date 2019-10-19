package actors

import (
	"bufio"
	"context"
	"database/sql"
	"fmt"
	pq "github.com/lib/pq"
	"log"
	"os"
	"strconv"
	"strings"
	"sync"
)

const batchSize = 10000
var dbExecs = make([]func() error, 0, 20000)


func main() {
	connStr := "host=localhost user=hypertube password=hypertube dbname=hypertube sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	file, err := os.Open("/Users/remi/Downloads/name.basics.tsv")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	scanner.Scan()

	tg := WithLimit(8)

	n := 0

	for scanner.Scan() {
		//nconst  primaryName     birthYear       deathYear       primaryProfession       knownForTitles
		data := strings.Split(scanner.Text(), "\t")
		var birthYear *int = nil
		if data[2] != "\\N" && data[2] != "" {
			if val, err := strconv.Atoi(data[2]); err == nil {
				birthYear = &val
			}
		}
		var deathYear *int = nil
		if data[3] != "\\N" && data[3] != "" {
			if val, err := strconv.Atoi(data[3]); err == nil {
				deathYear = &val
			}
		}

		dbExecs = append(dbExecs, func() error {
			if _, err := db.Exec(`
			INSERT INTO actors (id, name, "birthYear", "deathYear", "knownForMovies")
			VALUES ($1, $2, $3, $4, $5)
		`, data[0], data[1], birthYear, deathYear, pq.Array(strings.Split(data[5], ","))); err != nil {
				fmt.Printf("%v\n", data)
				fmt.Println(err)
				os.Exit(1)
				return err
			}
		return nil
		})
		n++

		if n > batchSize {
			x := dbExecs
			n = 0
			dbExecs = make([]func() error, 0)
			tg.Go(func() error {
				for _, f := range x {
					_ = f()
				}
				return nil
			})
		}



	}

	tg.Wait()

	if len(dbExecs) > 0 {
		for _, f := range dbExecs {
			_ = f()
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}

// A TaskGroup is a collection of goroutines working on subtasks that are part of
// the same overall task.
//
// A zero TaskGroup is valid and does not cancel on error.
type TaskGroup struct {
	cancel func()
	sem    chan struct{}

	wg sync.WaitGroup

	errOnce sync.Once
	err     error
}

// WithLimit returns a new TaskGroup which limits the number of concurrent goroutines to `n`.
func WithLimit(n int) *TaskGroup {
	return &TaskGroup{
		sem: make(chan struct{}, n),
	}
}

// WithContext returns a new TaskGroup and an associated Context derived from ctx.
//
// The derived Context is canceled the first time a function passed to Go
// returns a non-nil error or the first time waitUntilRelease returns, whichever occurs
// first.
func WithContext(ctx context.Context) (*TaskGroup, context.Context) {
	ctx, cancel := context.WithCancel(ctx)

	return &TaskGroup{
		cancel: cancel,
	}, ctx
}

// Limit limits this group to `n` concurrent goroutines.
func (g *TaskGroup) Limit(n int) *TaskGroup {
	g.sem = make(chan struct{}, n)
	return g
}

// waitUntilRelease blocks until all function calls from the Go method have returned, then
// returns the first non-nil error (if any) from them.
func (g *TaskGroup) Wait() error {
	g.wg.Wait()
	if g.cancel != nil {
		g.cancel()
	}
	return g.err
}

// Go calls the given function in a new goroutine.
//
// The first call to return a non-nil error cancels the group; its error will be
// returned by waitUntilRelease.
func (g *TaskGroup) Go(f func() error) {
	if g.sem != nil {
		g.sem <- struct{}{}
	}

	g.wg.Add(1)

	go func() {
		defer func() {
			if g.sem != nil {
				<-g.sem
			}
			g.wg.Done()
		}()

		if err := f(); err != nil {
			g.errOnce.Do(func() {
				g.err = err
				if g.cancel != nil {
					g.cancel()
				}
			})
		}
	}()
}
