import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  privacy: DataTypes.STRING,
  duration: DataTypes.INTEGER,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Video;