const server = require('../../../server');
const Concert = require('../../../models/concerts.model');
const chai = require('chai');
const chaiHttp = require('chai-http');


chai.use(chaiHttp);


const expect = chai.expect;
const request = chai.request;


describe('GET /api/concerts', () => {
    before(async () => {
        const testConcertOne = new Concert(
            { 
                _id: '5d9f1140f10a81216cfd4408', 
                performer: 'Performer1',
                genre: 'Genre1',
                price: 32,
                day: 1,
                image: '/image1.jpg'
            });
        await testConcertOne.save();
     
        const testConcertTwo = new Concert(
            { 
                _id: '5d9f1140f10a81216cfd4409', 
                performer: 'Performer2',
                genre: 'Genre2',
                price: 20,
                day: 1,
                image: '/image2.jpg'
            });
        await testConcertTwo.save();
    });

    it('/ should return all concerts', async () => {
        const res = await request(server).get('/api/concerts');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.equal(2);
    });
    it('/:id should return one concert by :id ', async () => {
        const res = await request(server).get('/api/concerts/5d9f1140f10a81216cfd4408');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.not.be.null;
    });
    it('performer/:performer should return all concerts by :performer ', async () => {
        const res = await request(server).get('/api/concerts/performer/Performer1');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.not.be.null;
    });
    it('genre/:genre should return all concerts by :genre ', async () => {
        const res = await request(server).get('/api/concerts/genre/Genre1');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.not.be.null;
    });
    it('/price/day/:day should return all concerts by :day ', async () => {
        const res = await request(server).get('/api/concerts/price/day/1');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.not.be.null;
    });
    it('/price/:price_min/:price_max should return all concerts by :price_min/:price_ma ', async () => {
        const res = await request(server).get('/api/concerts/price/19/25');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.not.be.null;
    });
    
    after(async () => {
        await Concert.deleteMany();
    });
});
