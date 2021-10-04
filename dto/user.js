const userDTO = {
  getUserData: ({ id, email, telegramChatId, name, surname, dateCreated }) => ({
    id,
    email,
    telegramChatId,
    name,
    surname,
    dateCreated,
    image: undefined,
  }),
};

module.exports = userDTO;
