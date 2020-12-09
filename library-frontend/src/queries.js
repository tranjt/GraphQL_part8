import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $numPublished: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $numPublished,
      genres: $genres
    ) {
      title
      author
    }
  }
`
export const UPDATE_AUTHOR = gql`
  mutation updateAuthor($name: String!, $numYear: Int!) {
    editAuthor(    
      name: $name,
      setBornTo: $numYear  
    ) {
      name
      born
    }
  }
`
