export default (res) => {
  return {
    success(data) {
      res.status(200).json({
        status: 200,
        data,
      });
    },

    notFound(data) {
      res.status(404).json({
        status: 404,
        message: data,
      });
    }
  }
}
