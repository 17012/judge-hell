import { publicUpload, withSignedUrlUpload } from '../services/bucket-upload';
export default ({ Problem }) => async (req, res, next) => {
  try {
    // TODO: save problem data in mongodb
    const data = JSON.parse(req.body.data);
    const { problemName, time, memory } = data;
    const { filePdf, fileInput, fileOutput } = req.files;

    const options = {
      destination: `${problemName}/problem.pdf`,
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    };

    const problemUrl = await publicUpload(filePdf[0].path, options);

    const inputUrl = await Promise.all(
      fileInput.map(file => {
        const options = {
          destination: `${problemName}/${file.originalname}`,
          gzip: true,
          metadata: {
            cacheControl: 'public, max-age=31536000',
          },
        };
        const config = {
          action: 'read',
          expires: '03-17-2025',
        };
        return withSignedUrlUpload(file.path, options, config);
      }),
    );

    const outputUrl = await Promise.all(
      fileOutput.map(file => {
        const options = {
          destination: `${problemName}/${file.originalname}`,
          gzip: true,
          metadata: {
            cacheControl: 'public, max-age=31536000',
          },
        };
        const config = {
          action: 'read',
          expires: '03-17-2025',
        };
        return withSignedUrlUpload(file.path, options, config);
      }),
    );

    const problem = await Problem.create({
      name: problemName,
      pdf: problemUrl,
      input: inputUrl,
      output: outputUrl,
      time,
      memory,
    });

    return res.status(200).json(problem);
  } catch (e) {
    next(e);
  }
};
