const puppeteer = require('puppeteer');
const unirest = require('unirest');

//const API_KEY = "aullc00kvuh16heludqmj9hcou"
const API_KEY = "t2mvrakptcfiak2f4akdvbkilu"
const WEBTOOLS_URL = "http://dev.local:8080"
const SEGMENT_FIRST = {
  name: "first_visit",
  externalId: 3,
  dsl: 'segment().site("test_site").and(rule(FIRSTVISIT));',
  active: true
};
const SEGMENT_RETURNING = {
  name: "returning_visitor",
  externalId: 4,
  dsl: 'segment().site("test_site").not(rule(FIRSTVISIT));',
  active: true
};

jest.setTimeout(10000);

beforeAll(() => {
  unirest.post(WEBTOOLS_URL + '/rest/audience')
    .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'apikey': API_KEY })
    .send(SEGMENT_FIRST)
    .end(function (response) {
      console.log("segment: ", response.body);
    });
  unirest.post(WEBTOOLS_URL + '/rest/audience')
    .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'apikey': API_KEY })
    .send(SEGMENT_RETURNING)
    .end(function (response) {
      console.log("segment: ", response.body);
    });
});

describe('FirstVisit Rule', () => {
  var browser, page;
  var url = 'http://dev.local:2015/rule_visit.html'
  var url2 = 'http://dev.local:2015/rule_visit2.html'

  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  })

  afterEach(() => {
    browser.close()
  })

  test('first visit', async (done) => {
    await page.goto(url);

    let uid = await page.evaluate(() => {
      return localStorage.getItem('_tma_uid');
    });
    console.log(uid);
    expect(uid).not.toBeNull();
    expect(uid).not.toBe('');

    setTimeout(() => {
      unirest.get(WEBTOOLS_URL + '/rest/userinformation/user?user=' + uid)
        .headers({ 'Accept': 'application/json', 'Content-Type': 'text/plain', 'apikey': API_KEY })
        .send()
        .end(function (response) {
          console.log(JSON.stringify(response.body));
          let segment = get_segment(response.body.user.actionSystem.segments, 3)
          expect(segment.wpid).toBe(3);
          done()
        });
    }, 5000);
  });

  test('returning', async (done) => {

    await page.goto(url2);
    await page.reload();

    let uid = await page.evaluate(() => {
      return localStorage.getItem('_tma_uid');
    });
    console.log(uid);
    expect(uid).not.toBeNull();
    expect(uid).not.toBe('');

    await page.goto(url2);
    await page.reload();

    setTimeout(() => {
      unirest.get(WEBTOOLS_URL + '/rest/userinformation/user?user=' + uid)
        .headers({ 'Accept': 'application/json', 'Content-Type': 'text/plain', 'apikey': API_KEY })
        .send()
        .end(function (response) {
          console.log(JSON.stringify(response.body));
          let segment = get_segment(response.body.user.actionSystem.segments, 4)
          expect(segment.wpid).toBe(4);
          done()
        });
    }, 5000);
  });
})

function get_segment (the_array, segid) {
  return the_array.find(e => e.wpid == segid);
}