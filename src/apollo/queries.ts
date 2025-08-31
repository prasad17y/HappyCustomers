import {gql} from '@apollo/client';

export const LIST_ZELLER_CUSTOMERS = gql`
  query ListZellerCustomers {
    listZellerCustomers {
      items {
        id
        name
        email
        role
      }
      nextToken
    }
  }
`;
