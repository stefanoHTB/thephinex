export const productsCustomQuery = (selectedFields: string[]) => {
    return `
   { 
     products {
          edges {
            node {
              ${selectedFields.map(field => `${field}`).join('\n')}
            }
          }
        }
      }
    `;
};
