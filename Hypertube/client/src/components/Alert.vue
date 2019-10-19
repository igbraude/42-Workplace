<template>
    <b-alert v-if="error" variant="danger" style="word-break: break-word" show>{{error.message}}</b-alert>
</template>

<script>
export default {
    name: 'Alert',
    props: {
        error: Error,
    },
}
</script>
