const shortid = require('shortid')
const { createWriteStream, createReadStream, mkdir } = require( "fs");

const File = require('../../models/File');

const storeUpload = async ({ stream, filename, mimetype }) => {
    const id = shortid.generate();
    const path = `images/${id}-${filename}`;

    return new Promise((resolve, reject) =>
        stream
            .pipe(createWriteStream(path))
            .on("finish", () => resolve({ id, path, filename, mimetype }))
            .on("error", reject)
    );
};

const processUpload = async upload => {
    const { createReadStream,filename, mimetype } = await upload;
    const stream = await createReadStream();
    const file = await storeUpload({ stream, filename, mimetype });
    return file;
};

module.exports =  {
    Query: {
        hello: () => "Hello world"
    },
    Mutation: {
         async uploadFile( { file },req)  {
             if (!req.isAuth) {
                 throw new Error('Unauthenticated!');
             }
            mkdir("images", { recursive: true }, err => {
                if (err) throw err;
            });
            console.log(req.username)
            const upload = await processUpload(file.file);
            await File.create(upload);
            upload.username = req.username;
            return upload;
        }
    }
};