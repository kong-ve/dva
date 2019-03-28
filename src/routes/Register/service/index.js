import $$ from 'cmn-utils';

export async function register(payload) { debugger
  return $$.post('https://mishuo-test.myshopify.com/admin/customers.json', payload);
}