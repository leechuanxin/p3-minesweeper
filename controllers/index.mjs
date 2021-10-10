export default function initIndexController(db) {
  const index = async (request, response) => {
    const games = await db.Game.findAll({
      where: {
        isCompleted: {
          [db.Sequelize.Op.eq]: false,
        },
      },
    });

    response.render('index/index', { user: request.user, games });
  };

  return {
    index,
  };
}
