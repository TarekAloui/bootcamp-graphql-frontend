import gql from 'graphql-tag'

export const GET_ALL_AUTHORS = gql`
  query authors {
    allAuthors {
      id,
      firstName,
      lastName,
      address {
        street,
        city,
      }
      books {
        title,
        language,
        numPages,
      },
    }
  }
`

export const ADD_AUTHOR = gql`
  mutation addAuthor($author: addAuthorInput!) {
    addAuthor(author: $author) {
      firstName
      lastName
      age
      email
    }
  }
`
