module.exports = (sequelize, DataTypes) => {

    const Token = sequelize.define("refresh_token", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        createdAt: 'created_at',
        updatedAt: false
    });
    Token.removeAttribute('id');

    return Token
}