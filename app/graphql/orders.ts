export const ordersQuery = `
{
    orders {
        edges {
          node {
            confirmed
            createdAt
            id
          }
        }
      } 
}
`