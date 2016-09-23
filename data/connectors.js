import Sequelize from 'sequelize';
import casual from 'casual';
import _ from 'lodash';

const db = new Sequelize('blog', 'dbu', 'hello123', {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

const AuthorModel = db.define('author', {
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
});

const PostModel = db.define('post', {
  title: {
    type: Sequelize.STRING,
  },
  text: {
    type: Sequelize.STRING,
  },
  tags: {
    type: Sequelize.STRING,
  },
  views: {
    type: Sequelize.INTEGER,
  }
});


// Relations
AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

// Create some example data in db
casual.seed(123);
db.sync({ force: true }).then(()=> {
  _.times(10, ()=> {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then(author => {
      return author.createPost({
        title: `A post by ${author.firstName} ${author.lastName}`,
        text: casual.sentences(3),
        tags: casual.words(3).split(' ').join(','),
        views: casual.integer(0, 100),
      });
    });
  });
});

const Author = db.models.author;
const Post = db.models.post;

export { Author, Post };
