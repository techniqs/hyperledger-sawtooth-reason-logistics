export default {
    Query: {
      getAgent: async (parent, { pubKey }, { models }) => {
        console.log("DAFUQ", pubKey);
        return await models.Agent.findByPk(pubKey);
      },
    },
    Mutation: {
      createAgent: async (parent, { input }, { models }) => {
        console.log("PARENT",parent);
        console.log("INPUT",input);
        return await models.Agent.create({
          pubKey:input.pubKey,
          userName:input.userName,
        });
      },
    },
  };
  