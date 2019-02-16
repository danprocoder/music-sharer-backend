export default (res) => {
  return {
    success(data) {
      res.status(200).json({
        status: 200,
        data,
      });
    },

    notFound(data) {

    }
  }
}
