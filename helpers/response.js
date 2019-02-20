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
    },

    forbidden() {
      res.status(400).json({
        status: 400,
        message: 'Forbidden',
      });
    },

    internalServerError(message=null) {
      res.status(500).send({
        status: 500,
        message: message || 'Internal Server Error',
      });
    },

    badRequest(error) {
      res.status(400).send({
        status: 400,
        message: error,
      });
    },
  }
}
