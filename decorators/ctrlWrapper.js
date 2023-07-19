const ctrlWrapper = (ctrl) => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
         // шукає функцію з 4 параметрами, знаходить в app.use(універсальній функції обробки помилок)
      next(error);
    }
  };
  return func;
};

export default ctrlWrapper;
