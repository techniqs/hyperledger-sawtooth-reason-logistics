export default {
    Query: {
      getAgent: async (parent, { pubKey }, { models }) => {
        return await models.Agent.findByPk(pubKey);
      },
    },
  };
  