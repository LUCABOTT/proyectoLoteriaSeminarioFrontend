import lotteryApi from "./lotteryApi";

export const getAllLotteries = async () => {
  try {
    const res = await lotteryApi.getLotteries();
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al obtener loterías");
  }
};

export const getLottery = async (id) => {
  try {
    const res = await lotteryApi.getLotteryById(id);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al obtener lotería");
  }
};

export const buyTicket = async (userId, lotteryId, numbers) => {
  try {
    const res = await lotteryApi.purchaseTicket(userId, lotteryId, numbers);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al comprar ticket");
  }
};

export const getMyTickets = async (userId) => {
  try {
    const res = await lotteryApi.getUserPurchases(userId);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al obtener tickets");
  }
};

export const getLotteryResults = async (lotteryId = null) => {
  try {
    const res = await lotteryApi.getResults(lotteryId);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al obtener resultados");
  }
};
