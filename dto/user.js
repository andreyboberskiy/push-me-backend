const userDTO = {
  getUserData: ({ _id, email, telegramChatId }) => ({
    id: _id,
    email,
    telegramChatId,
  }),
};

module.exports = userDTO;
