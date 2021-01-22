import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import React, { useState } from 'react'
import { ADD_AUTHOR, GET_ALL_AUTHORS } from './graphql'

const Home = () => {
  const [getAllAuthors, {
    data, error, loading, called,
  }] = useLazyQuery(GET_ALL_AUTHORS)


  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')

  const newAuthor = {
    firstName,
    lastName,
    age: parseInt(age),
    email,
  }

  console.log(newAuthor)

  const [addAuthor, { error: errorAdd, loading: loadingAdd }] = useMutation(ADD_AUTHOR, {
    variables: {
      author: newAuthor,
    },
    // refetchQueries: () => [{ query: GET_ALL_AUTHORS }], // first solution
    update: (client, { data: { allAuthors } }) => {
      try {
        const newData = client.readQuery({ query: GET_ALL_AUTHORS })
        newData.allAuthors = [...data.allAuthors, addAuthor]
        client.writeQuery({ query: GET_ALL_AUTHORS, data: newData })
      } catch (error) {
        // log something if in dev environment
      }
    },
  })

  if (!loading && called) console.log(`DATA ${data}`)
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <input type="text" placeholder="First Name" onChange={e => setFirstName(e.target.value)} value={firstName} />
      <input type="text" placeholder="Last Name" onChange={e => setLastName(e.target.value)} value={lastName} />
      <input type="text" placeholder="age" onChange={e => setAge(e.target.value)} value={age} />
      <input type="text" placeholder="email" onChange={e => setEmail(e.target.value)} value={email} />

      <button type="submit" onClick={addAuthor}>AddAuthor</button>

      <button type="submit" onClick={getAllAuthors}>LOAD</button>
      {error || errorAdd
        ? <p>ERROR</p>
        : (called && !loading
          ? data.allAuthors.map(a => (<p>{`${a.firstName} ${a.lastName}`}</p>))
          : (<div>loading</div>)
        )}
    </div>
  )
}


export default Home
