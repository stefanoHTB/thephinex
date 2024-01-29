export const customersQuery = `
{
    customers {
        edges {
          node {
            id
            email
            firstName
            lastName
            createdAt
            phone
            verifiedEmail
          }
        }
      }
}`