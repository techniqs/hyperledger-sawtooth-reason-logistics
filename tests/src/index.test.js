import { createKeyPair} from './components/keyHandler';
import { createUserTransaction, createWareTransaction } from './components/transactionCreation';
import { sendBatch } from './components/requestHandler';
import moment from 'moment';

let firstUserKeys = createKeyPair();
let secondUserKeys = createKeyPair();
let notExistingUserKeys = createKeyPair();

const userValidationTests = async () => {
  test('Create valid user #1', () => {
    const timestamp = moment().unix();
    const batch = createUserTransaction(firstUserKeys, "VALID USER", timestamp);
    return sendBatch(batch).then(function (parsedBody) {

      const body = JSON.parse(parsedBody);
      const status = body.data[0].status;

      expect(status).toBe("COMMITTED");

    })

  });
  test('Create invalid user', () => {
    const timestamp = moment().unix();
    const batch = createUserTransaction(firstUserKeys, "INVALID", timestamp);
    return sendBatch(batch).then(function (parsedBody) {

      const body = JSON.parse(parsedBody);
      const status = body.data[0].status;
      const message = (body.data[0].invalid_transactions[0].message);
      expect(status).toBe("INVALID");
      expect(message).toBe(`Cannot create User! Public_key: ${firstUserKeys.pubKey} already exists!`);
    })
  });

  test('Create valid user #2', () => {
    const timestamp = moment().unix();
    const batch = createUserTransaction(secondUserKeys, "asdf2", timestamp);
    return sendBatch(batch).then(function (parsedBody) {

      const body = JSON.parse(parsedBody);
      const status = body.data[0].status;

      expect(status).toBe("COMMITTED");

    })

  });
}


const wareValidationTests = async () => {
  test('Create valid ware', () => {
    const timestamp = moment().unix();
    const input = {ean: "123456789", owner: firstUserKeys.pubKey,
    name: "validWare", uvp: 22.99, longitude: 23, latitude: 24 };
    const batch = createWareTransaction(firstUserKeys, input, timestamp);
    return sendBatch(batch).then(function (parsedBody) {

      const body = JSON.parse(parsedBody);
      const status = body.data[0].status;

      expect(status).toBe("COMMITTED");

    })
  });

  test('Create valid ware with not existing user', () => {
    const timestamp = moment().unix();
    const input = {ean: "1234567891", owner: notExistingUserKeys.pubKey,
    name: "validWare", uvp: 22.99, longitude: 23, latitude: 24 };
    const batch = createWareTransaction(notExistingUserKeys, input, timestamp);
    return sendBatch(batch).then(function (parsedBody) {

      const body = JSON.parse(parsedBody);
      const status = body.data[0].status;


      const message = (body.data[0].invalid_transactions[0].message);
      expect(status).toBe("INVALID");
      expect(message).toBe(`User with public_key: ${notExistingUserKeys.pubKey} doesn't exist!`);

    })
  });

  test('Create ware with invalid longitude', () => {
    const timestamp = moment().unix();
    const input = {ean: "1234526789", owner: firstUserKeys.pubKey,
    name: "validWare", uvp: 22.99, longitude: 190, latitude: 24 };
    const batch = createWareTransaction(firstUserKeys, input, timestamp);
    return sendBatch(batch).then(function (parsedBody) {

      const body = JSON.parse(parsedBody);
      const status = body.data[0].status;

      const message = (body.data[0].invalid_transactions[0].message);
      expect(status).toBe("INVALID");
      expect(message).toBe(`Longitude must be between -180 and 180. Got 190`);

    })
  });

  test('Create ware with invalid latitude', () => {
    const timestamp = moment().unix();
    const input = {ean: "1234526789", owner: firstUserKeys.pubKey,
    name: "validWare", uvp: 24.99, longitude: 23, latitude: 99 };
    const batch = createWareTransaction(firstUserKeys, input, timestamp);
    return sendBatch(batch).then(function (parsedBody) {

      const body = JSON.parse(parsedBody);
      const status = body.data[0].status;

      const message = (body.data[0].invalid_transactions[0].message);
      expect(status).toBe("INVALID");
      expect(message).toBe(`Latitude must be between -90 and 90. Got 99`);

    })
  });

  test('Update ware attributes', () => {
    const timestamp = moment().unix();
    const input = {ean: "123456789", owner: firstUserKeys.pubKey,
    name: "updatedware", uvp: 23.99, longitude: 23, latitude: 24 };
    const batch = createWareTransaction(firstUserKeys, input, timestamp);
    return sendBatch(batch).then(function (parsedBody) {

      const body = JSON.parse(parsedBody);
      const status = body.data[0].status;

      expect(status).toBe("COMMITTED");

    })
  });

  test('Update ware location', () => {
    const timestamp = moment().unix();
    const input = {ean: "123456789", owner: firstUserKeys.pubKey,
    name: "updatedware", uvp: 23.99, longitude: 50, latitude: 50 };
    const batch = createWareTransaction(firstUserKeys, input, timestamp);
    return sendBatch(batch).then(function (parsedBody) {

      const body = JSON.parse(parsedBody);
      const status = body.data[0].status;

      expect(status).toBe("COMMITTED");

    })
  });

  test('Transfer ware to new owner', () => {
    const timestamp = moment().unix();
    const input = {ean: "123456789", owner: secondUserKeys.pubKey,
    name: "updatedware", uvp: 23.99, longitude: 50, latitude: 50 };
    const batch = createWareTransaction(secondUserKeys, input, timestamp);
    return sendBatch(batch).then(function (parsedBody) {

      const body = JSON.parse(parsedBody);
      const status = body.data[0].status;

      expect(status).toBe("COMMITTED");

    })
  });

}





userValidationTests();
wareValidationTests();
