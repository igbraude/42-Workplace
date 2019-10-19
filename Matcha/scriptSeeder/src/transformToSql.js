const fs = require('fs');
const uuidv4 = require('uuid/v4');

const tagsList = ['Sloth', 'Lust', 'Wrath', 'Envy', 'Pride', 'Gluttony', 'Greed'];
let utilityUser = [];

fs.readFile('./data/users-1563106056506.json', 'utf8', (err, users) => {
    if (err) {
        console.log("Error reading file from disk:", err);
        return
    }
    try {
        const parsedUser = JSON.parse(users);

        // INSERT USERS
        let userInsert = "INSERT INTO users (user_id, username, password, email, verification_token, verified, first_name, last_name, account_completed, gender, sexual_orientation, bio, tags, picture_init, age) VALUES ";
        parsedUser.map(user =>
            userInsert = userInsert + "('"
                + getUsedId(uuidv4(), user.gender, user.lat, user.lng) +
                "', '" + user.username +
                "', '" + "4f42378d53b50a1c73d9a57f1550540ea0c3c0d5ceaf671394f2d200d4f95eafdcd6ff816c08e4c4364dc3ccc8bcf5a29cb003f05ff3089df5c852dc30d8fd8c" +
                "', '" + user.email +
                "', '" + uuidv4() +
                "', '" + true +
                "', '" + user.firstName +
                "', '" + user.lastName +
                "', '" + true +
                "', '" + user.gender +
                "', '" + user.sexualOrientation +
                "', '" + user.bio +
                "', '" + refinedTags(getRandomTags(tagsList)) +
                "', '" + true +
                "', " + user.age +
                "),"
        );
        userInsert = userInsert.slice(0, -1);



        // INSERT PICTURE
        let pictureInsert = "INSERT INTO pictures (picture_id, user_id, picture, \"primary\") VALUES ";
        utilityUser.map(user =>
            pictureInsert = pictureInsert + setPicture(user)
        );
        pictureInsert = pictureInsert.slice(0, -1);

        // INSERT GEOM
        let geomInsert = "INSERT INTO geolocation (user_id, lat, lng) VALUES ";
        utilityUser.map(user =>
            geomInsert = geomInsert + "('"
                + user.userId +
                "', '" + user.lat.replace(",", ".") +
                "', '" + user.lng.replace(",", ".") +
                "'),"
        );
        geomInsert = geomInsert.slice(0, -1);

        // LIKE INSERT
        let likeInsert = "INSERT INTO likes (user_id, liked_user_id) VALUES ";
        utilityUser.map(user =>
            likeInsert = likeInsert + setRandomCouples(utilityUser, user.userId)
        );
        likeInsert = likeInsert.slice(0, -1);

        // VISITS INSERT
        let visitsInsert = "INSERT INTO visits (visited_user_id, visitor_user_id) VALUES ";
        utilityUser.map(user =>
            visitsInsert = visitsInsert + setRandomCouples(utilityUser, user.userId)
        );
        visitsInsert = visitsInsert.slice(0, -1);

        // SETUP THE STRING AND WRITE IN THE SEED FILE
        let content = userInsert + "\n\n\n\n" + pictureInsert + "\n\n\n\n" + geomInsert + "\n\n\n\n" + likeInsert + "\n\n\n\n" + visitsInsert
        fs.writeFile('seed.sql', content, function (err) {
            if (err)
                return console.log(err);
            console.log('Seed has been watered correctly');
        });
    } catch (err) {
        console.log('Error parsing JSON string:', err)
    }
});

///////////////////////////////////////////////////
////                                           ////
////             utility functions             ////
////                                           ////
///////////////////////////////////////////////////

function setPicture(user) {
    let imageId = imagesId[Math.floor(Math.random() * (imagesId.length))];

    return "('"
        + imageId +
        "', '" + user.userId +
        "', '" + `./img/${imageId}.jpg` +
        "', " + true +
        "),";
}

function setRandomCouples(a, userId) {
    let r = "";
    let m = Math.floor(Math.random() * (a.length));
    m = m === 0 ? 1 : m;
    for (let i = 0; i < m; i++) {
        r = r + "('" +
            userId +
            "', '" + a[Math.floor(Math.random() * (a.length))].userId +
            "'),"
    }
    return r
}

function getRandomTags(a) {
    let r = [];
    let m = Math.floor(Math.random() * (a.length));
    m = m === 0 ? 1 : m;
    for (let i = 0; i < m; i++) {
        r = [...r, a[Math.floor(Math.random() * (a.length))]]
    }
    return r;
}

function refinedTags(a) {
    let tags = "{";
    a.map(tag =>
        tags = tags + tag + ", "
    );
    tags = tags.slice(0, -2);
    tags = tags + "}";
    return tags;
}

function getUsedId(userId, gender, lat, lng) {
    utilityUser = [...utilityUser, {userId: userId, gender: gender, lat: lat, lng: lng}];
    return userId
}

///////////////////////////////////////////////////
////                                           ////
////                useful data                ////
////                                           ////
///////////////////////////////////////////////////

const imagesId = [
    'ee8fb4ff-7631-4aaa-bab9-22f043cb9c5d',
    '482a40b6-53f0-4cfc-bb5a-5b6023529371',
    '2d950503-54f9-47fe-9fbc-6a3ed3728b3a',
    'e70bae41-3f51-44e0-89d7-e36ec8012182',
    '2bfed3c8-9142-46a0-b107-0f02104ddd61',
    'b7a5b73d-4f9e-445c-85d3-c2147ded0207',
    '3df290a1-8506-4ff8-b355-14bb07d4d81f',
    'e8fe9b4c-ac79-48dd-ae3e-bfb6a25e77bd',
    'e9c46b9e-6659-48e0-aa1b-ba949d92bfcf',
    '77e4b94a-f6ef-40d7-9248-a3e3872a818b',
    '892d244f-47ed-49f6-b361-ed2c0c061b8c',
    'ce51b13a-06ba-40bb-a7dd-ee2bd66984c6',
    '7fb4a488-f03a-46ac-bd01-c5b7b6e9ca06',
    '0bcabcf5-aebd-412e-b66f-347c558ce935',
    'e406f0bd-162d-4313-93c3-c5727b573d98',
    'bcc99f67-24c7-4a4c-a646-6fc0809acdd3',
    '15906238-92b0-4a8f-91cd-670a354a5ef9',
    '82354eec-30db-4333-b13f-a3fed50ced72',
    '91b4dd01-be05-4bd7-98e4-b521d9a2d2fd',
    'cd96f264-97a6-4bc2-95c3-58109e2f9f26',
    '92a8927f-8da9-4758-8aa4-050f7053c2ef',
    '9e0ab64e-4857-4f53-9411-e2680421b62d',
    'd3a10d9e-2451-4339-adb9-a8c44c298957',
    '9c5cc80c-1980-4e95-beb1-f41af3573625',
    'c4286db1-eac4-493e-baea-71ec8aa91b85',
    '4eed988b-9877-40a2-a79c-cd43857c641f',
    'cf4ecbe2-2fd7-4556-9936-1a04c7f63fa7',
    'cd5ef1b8-2227-48a2-8b93-d10e99f9638f',
    '5b15693c-038b-40b3-9fe7-9d12f1388a2b',
    '0bd78053-a140-40fd-9a18-cb3edadf6a1d',
    'b54b98dc-70cb-4868-8913-d2d90f2f5c6c',
    '82e18ce0-8172-4947-a568-8fa9e1b4c9de',
    'a99fbe8a-ddaa-4416-ae4e-0d5ea3880bbb',
    '5bdeace7-0b8e-4144-a704-dbc8302ae353',
    '455231c3-0825-4eb0-ac9b-2be46cebf51a',
    'd1022280-e58e-483f-b0b8-8a49aeb5bc75',
    '3cd3028a-eb43-4402-a335-bcff0ac7b939',
    'efa63d1e-03d7-4d22-b94d-e428dae109ca',
    'be9ea06e-5604-4550-a82e-04dc88351d8b',
    'd6d227bd-5f6e-4242-ba77-2b6a7eb5326a',
    'c2a022e0-3687-4710-b1a8-8e12362b21db',
    'c60ac10f-49ce-4d22-9695-85941710e030',
    'f7651dde-e9cf-469f-8d6d-8009f4ba87ce',
    '00a3f590-4413-4d55-ad7a-7711f80570f2',
    '6643f869-d975-410c-bb87-0ddb28b31fbd',
    '8c353769-08c8-4535-bbbc-0608fda9e2fa',
    'b392c073-caa3-4a5c-bf90-bac76d4b52d1',
    '551c33b7-6aa0-47fa-b127-e561e1e03153',
    'f224b397-c9f9-426a-96a3-76ab22a951b6',
    '52ce779b-6bec-4d8c-97ab-288a4d2aeed5',
    '48f935bc-b8d3-43ed-b0a4-05906b3fd2e3',
    '03efc48f-8b35-4c7d-bc47-ea4129d2fdad',
    '7f86b276-bb35-4e1a-8fe7-4af442a80d5e',
    '08ef2a6d-1008-482c-95e6-0ed2d969cec6',
    '14a219e2-13b3-4278-8442-f2b28039cdbc',
    'ea168ffe-c88f-4c2b-acbc-3aac4d32d16b',
    'b1302562-65a5-4c66-a442-9eebefe41e26',
    'a593e5ba-7435-42dc-b59b-a61645e423d7',
    'd4e3ba36-55d7-4305-bdbd-bf3c69f5242c',
    '095055c9-b60b-42fe-9da9-29a4523f9700',
    '36b02938-790f-4ef2-9cce-f778b2b390e5',
    'e0f494b2-31d3-49a6-b77a-511286491060',
    'b6f5b5eb-4a42-400b-81ad-c8066c53a06b',
    '9ecfafda-d013-4de0-a063-5c9253fd4b9e',
    'b2dd6af8-6261-4018-a5d2-3d01011f7ee3',
    '1157b2be-fe58-426d-b2cc-90a7de85bfb8',
    'aa3a79cd-3954-4f21-8981-b9177544aab6',
    '6f49a05f-6b85-43d3-b442-b408d1c82247',
    '59cbd224-7e56-480a-8a18-682ea65ebdc9',
    'eed5471f-05e5-4f87-a59b-ac46e9a5f345',
    'd5b1d926-63ce-4d75-9281-35e974cd0684',
    '4c2f6570-6170-4c54-9ce2-a2897d41e744',
    '536f3793-d0de-446b-838b-d32a2443baf8',
    '371160ef-4bfd-4cb8-8027-98e5efd32c8a',
    '8d0a6d69-dc99-40c0-b5f7-dc4261fd120f',
    '75145dc3-489b-4fd5-b74f-34e821cb2a47',
    'e7ccccd7-f192-43eb-8729-cb9c343b8f03',
    '1e5151fd-afad-45f2-8884-b3021a18df2d',
    'be8ca0dd-1e03-4bf0-babe-904436ad3aee',
    '0c2d1aa3-3c30-4336-af79-973a0429f33a',
    '750f656e-bb38-4e78-b789-e77681a15de3',
    '287625b1-e77b-414e-9565-c3f4c8860ef4',
    'f202f06b-c6d1-4c5f-a882-3acdcaf84d7a',
    'f819d10e-3eaf-4c13-a66b-e002729f357f',
    'cbfd1a6f-eaa8-4582-b24d-6ebb8724e9ff',
    "311a1619-2bb8-45be-8927-1a45772f578b",
    "cb8a30b4-3ba9-4ca9-8644-06ce71de7120",
    "4ab547ec-209a-48eb-9cc0-ededcd4f65bd",
    "26fa56ba-33fc-46ad-89ce-e0c05c160eaa",
    "a030e630-4750-4fcd-b8cf-fbbc3a21c5d4",
    "1a1a1798-49b7-4d13-adb3-9fa4b59ed5c9",
    "c50267d7-977f-4131-95a8-bd1ea3bea833",
    "b9a092b4-16fa-4ef2-a4d5-fef19f25dd04",
    "7deffba1-f19c-42ad-ae0d-f44a20959ff2",
    "ef7e96d8-8278-40c1-85d9-52da62531b1e",
    "308e9047-7292-402c-b251-cb3d1bd2a067",
    "01851682-ddcb-49fb-98da-c08126104a8f",
    "6cbe3c9d-7ec1-4994-8cdd-2e038a6f591e",
    "ba6246e8-7bc7-440c-a1fb-220549f23e25",
    "b62591c3-a12e-4149-b9da-b5ace8f732c3",
    "24664224-227a-4937-b13a-030e9b9c8e4e",
    "f414592d-9dc6-4732-b8eb-a2dfa11ae155",
    "faf3d397-5980-4637-943c-6c6e4029d7d7",
    "999cae2d-8782-45e3-b4a9-e2093592d0ad",
    "7604cf96-93e3-4720-b620-fda6362e5dc7",
    "4b88f1f1-f90e-4a17-9349-ae38ed7fd614",
    "a51a281b-9cba-4d41-9f45-6531b99820e0",
    "55155bda-5e26-45c1-ad0c-2dd07e621342",
    "aa70d567-69a3-4208-a5de-b66215e03a56",
    "b018c2bd-6f16-497f-b592-2ca2ca3660d6",
    "74377e5f-ef1d-4389-9566-1745c152b151",
    "523e91e1-5738-481d-b55e-907c2577dda1",
    "efa494ea-6b90-4eb5-9bd9-315887cdde87",
    "f567edca-fe67-4c2e-9b65-e8b6127cd109",
    "886954b7-8256-444d-ad48-8ca7022f71c6",
    "b227c86d-3747-4a40-bdd5-5d1d7a371a0c",
    "a11e5329-d777-49ef-89f8-609ede9a4177",
    "ba9bb30f-8da7-45eb-a4ce-190430fadce3",
    "a5fb3e36-130c-4f76-a6af-503a8e744d8d",
    "200459bd-583b-418d-843c-09e875a404d1",
    "f34be1aa-f264-4b68-8ec7-382a97bb63a7",
    "f28e34d8-ec94-43cf-aab9-589ebdb8e572",
    "d101bfc9-5a44-4b46-b2be-e8032e466a93",
    "0043cbab-7240-4a04-9df9-b08212572499",
    "a5c86572-050e-4dc8-ba52-e8e52db45cf5",
    "5276880a-c3a3-4a75-b73e-1d66e73b485c",
    "2a7b4aa7-6c3a-4bf7-887a-9923068cc3e1",
    "28050c83-bfb9-4dee-8ea0-ed9cc43b0bf9",
    "6dd0e29a-5030-456b-8725-74382c324967",
    "7768f4ef-4b51-490a-87a6-d4695d61684d",
    "ec3873b0-e4ab-4494-8254-e363329156b2",
    "1d360832-2148-449d-b734-3941c2043bff",
    "c42b088e-c096-41c4-b004-cc4d74bca06f",
    "e83ba7da-2330-47bc-8d6f-34ebc587c023",
    "b23def67-051d-4531-b096-df5e0f39b407",
    "d8ea0610-7116-49c2-9c0c-a1a0752d84ae",
    "74038115-55df-4a10-a8f1-a4670e025813",
    "0be9f1dc-2215-4d18-a29c-03d2509a5507",
    "d79d8ac5-7f66-47c9-b446-64b5bf0f0a95",
    "430bcd51-9479-4063-97a6-99129787f834",
    "e8f4f311-f8c3-47ff-8b3f-56f1196d3a62",
    "6c43ca7d-ca6b-4c9b-8e10-88bf40a7bde3",
    "fb6ee090-4eab-4789-8afc-1bca3fed4449",
    "b8ea6d94-b7f2-477d-aa9c-0739f22fe6d1",
    "8271e79a-4c62-4cac-a24d-c64491c4fec6",
    "dfdf34c3-2539-432f-98c0-89ba36bd21fb",
    "bd16012a-539f-447c-9196-b0692aca48d4",
    "07dd00ab-0bad-4d1a-8a69-9335954bc15d",
    "4953eaf1-2b5b-4dbd-bdf2-8ca9575cb730",
    "076ba9bb-d6e2-4ad6-8b58-45dfa1ef0b6f",
    "573b29ee-286a-4539-9aaa-28eef3dfc00c",
    "1615f3a7-9a50-40b2-ab00-2b6d62067126",
    "6a3c1cc5-c0be-4206-8ec3-7efceb58bffd",
    "914270b7-ddc8-488f-be15-e968373d0ae9",
    "9ec9ae6c-730f-4c31-91e5-bcddf690ac79",
    "f0cbdd19-77eb-41ba-bcd0-b767d08d08cd",
    "4a5c381d-487d-41a1-9b7d-23227bbb3b37",
    "cc51ad49-f1b7-4e21-a766-639f0eb421a1",
    "e6e97b04-39bf-4172-868b-12fd2c2f6d41",
    "ef60d0d4-6e48-497a-87da-a66fbd42d786",
    "af3c975f-946a-446a-ba4c-c67a5f7ad2fe",
    "c5481425-f7c1-4a41-9d58-75b68b3f4b38",
    "a5021ea1-1c63-4375-bf84-fa37fc201d91",
    "dd144de3-96cf-4bad-830f-46fb14af1c88",
    "58bbece5-4322-4ff3-b8b7-c5959cf5a67f",
    "39a12909-45c5-4afc-bf85-a2f0595dfd80",
    "42610149-d450-40e7-92cf-63a45d5499a4",
    "d173844f-d518-419d-bb38-94eb39f2805d",
    "251ed3e4-14ef-46d6-b976-41511adabec5",
    "51ae72eb-dc6a-4024-9688-447db81775c7",
    "e6aeec29-7b53-446a-aa9a-ce11f2dbcded",
    "292d74bd-6bca-4cb7-add8-437f460f0c60",
    "e7bbc9b3-3f42-41cf-9397-b82e63f21660",
    "64b16683-3f32-4cb2-b6fe-455dc44629e2",
    "ba0078d6-c24e-4498-b670-29f4d70d4a97",
    "45fb86ca-6c75-47de-ab8c-d76b182e1523",
    "6404f77b-f800-46a5-8c55-b2d7cf932313",
    "46606bcf-0cf0-44eb-8b0b-1a46032df9c0",
    "d75ca997-b28c-4386-938e-1ad83b72c20c",
    "7715fb72-403c-4d0b-a494-9a883cbad11e",
    "3ab4ab3e-3a29-466a-b432-929be32117c3",
    "399d7c32-e34d-4066-bd9b-11cfab8f3571",
    "76a77fe0-95cc-477d-92fa-45ae004c214c",
    "19657d0c-50de-4139-8a25-aad37a7a1829",
    "3155498b-2bab-4429-afcf-e0869478e637",
    "ee884a46-39fa-427a-bade-71d1b4977a68",
    "2b04aa1d-0da4-4343-83a8-4db4779eae43",
    "82dab879-6897-47db-8962-8787a2e79320",
    "8713809c-8bf3-4bf5-9f1c-65387231dd90",
    "37e9d59d-66fe-4a28-98f1-5bd65a96e0a5",
    "9cdab91e-b9a8-4e6f-9479-59b160975b90",
    "f3a868ae-fb67-4a95-8dbd-1fcc4599a25a",
    "8248306e-bed9-43e6-b073-6ea994c35c99",
    "b450b94a-2f98-44a8-a182-10a71fa55554",
    "5153ca40-7c95-4f9f-a30d-040bd65445f4",
    "25203dc2-089e-4f65-852d-689231d4ef89",
    "ae8a43a9-8f36-40e5-b8e4-d1dad03bab3b",
    "2065dfa0-0c3a-4f92-9c67-90d0a6d6b006",
    "dd91646e-5c32-4972-8903-00b40f902728",
    "378c10c8-6bd6-4cc9-89b4-9171462c90cc",
    "b21e57d2-90c2-4bf6-95d0-1d6fefb5f90b",
    "66f5b095-a049-435b-9aa4-04603fb24093",
    "61b49dbe-3745-46b6-9ba6-d6a7ba96d750",
    "801dbaf2-c122-4eca-af10-1ae82161b15a",
    "8209d09c-9dba-428f-8c34-1b82fafdf0f9",
    "f33efd17-7d5c-409e-b838-23c4366a5f41",
    "343d967e-5e6d-426d-a891-b475cf279cb8",
    "a03d1296-1698-4087-b698-1e8d9eaafba4",
    "ad2a55d6-4567-4476-bf82-f4cbb2e9a61b",
    "56050dd7-a86d-4673-ace1-1da4028b5094",
    "360bf9b8-dbc7-4b9c-b9e1-72a253b58a01",
    "98af4214-beb0-4315-9efc-c21377d0bfa1",
    "57d1998a-89b1-43fb-af1a-c311c84c025d",
    "960a517d-83e1-4beb-a49d-80fdc8f6a52c",
    "58e80874-0409-48e3-b619-ea4e5e1f35b0",
    "83b5f2b0-5cb3-4087-82f9-9a1c5e9775c5",
    "bde6e839-1ede-4333-857f-a9b753d9025c",
    "3da23cd5-1b0f-485d-9978-c678b436a85d",
    "64f0ea08-f11c-401e-aa71-7d13b7bef9e6",
    "e59c7fc8-8059-4669-8bb0-5a1a252006e5",
    "b9d1ba03-94f1-436c-b471-fe5c5738b6dd",
    "da283357-852b-4be2-87a9-ce7871c617ec",
    "b20d7068-d716-4870-afe6-7120f209ab90",
    "56bec460-08ad-49d5-8735-0d977e290566",
    "6ea9d228-a6c6-432c-a86e-f316484f26dc",
    "e8824949-6668-4209-b010-5274306f0c4e",
    "75db1205-3f1d-40fe-8de1-739604b864da",
    "0e3bffb3-bd14-470c-8caa-68ebdc3146fa",
    "1954bc11-4e8f-4eac-ada2-40b7e72177e0",
    "b74e9d3b-842a-41fb-b4f4-4fa9d9518fb7",
    "8e3e8bb9-afbc-4ed4-9074-21249d8925a1",
    "0addfdf6-fa19-4294-b897-86cc744010ce",
    "8d71ff61-65dd-4873-901d-7df05f544b82",
    "98d674b5-3582-46a8-8e96-156d589f46c0",
    "8ccbe686-8819-43d3-adf5-6d0321a76788",
    "45b673fc-f578-410a-b714-aee41200097c",
    "25a70ac2-b14d-42ff-b218-63117f67de23",
    "a4d0071c-cf51-450c-b299-d4bcb9d1a08d",
    "6945ab8c-d307-4eb6-938b-22eb3d880d9c",
    "19570d71-e4d7-488d-9089-fdb98ed7d489",
    "1a102910-f437-4983-860f-8cd9f3b171ad",
    "ff74a249-9049-4746-a278-1c50f254928e",
    "d3b1e342-4d54-454e-a520-72f48d4f7f91",
    "4158b236-2736-4f46-bbb0-eb0c412b4218",
    "7d416638-9cc4-46f1-a3b0-54e00bc9312e"
];