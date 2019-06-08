import Bucket from '../../config/storage';

export default ({ Problem }) => async (req, res, next) => {
  try {
    // TODO: save problem data in mongodb
    const data = JSON.parse(req.body.data);
    const { problemName, time, memory } = data;

    console.log('new file', req.file);
    // const problem = await Problem.create(data)
    console.log('======================');
    console.log(__dirname);
    console.log(__filename);
    const options = {
      destination: `${problemName}/problem.pdf`,
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    };
    // await Bucket.upload(req.file.path, options);
    console.log('success');
    return res.status(200).json('problem');
  } catch (e) {
    next(e);
  }
};
