const puppeteer = require('puppeteer');
const unirest = require('unirest');

//const API_KEY = "aullc00kvuh16heludqmj9hcou"
const API_KEY = "t2mvrakptcfiak2f4akdvbkilu"
const WEBTOOLS_URL = "http://dev.local:8080"
const SEGMENT = {
  name: "demo_score",
  externalId: 2,
  dsl: 'segment().site("test_site").and(rule(SCORE).name("demo").score(100));',
  active: true
};

jest.setTimeout(30000);

beforeAll(() => {
  unirest.post(WEBTOOLS_URL + '/rest/audience')
    .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'apikey': API_KEY })
    .send(SEGMENT)
    .end(function (response) {
      console.log("segment: ", response.body);
    });
});

describe('PageView Rule', () => {
  var browser, page;
  var url = 'http://dev.local:2015/rule_score.html'

  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  })

  afterEach(() => {
    browser.close()
  })

  test('no segment', async (done) => {
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
          let segment = get_segment(response.body.user.actionSystem.segments, 2)
          expect(segment).toBe(undefined);
          done()
        });
    }, 5000);
  });

  test('home segment', async (done) => {
    await page.goto(url);
    await page.reload();

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
          console.log(response.body);
          let segment = get_segment(response.body.user.actionSystem.segments, 2)
          expect(segment.wpid).toBe(2);
          done()
        });
    }, 5000);
  });
})


function get_segment (the_array, segid) {
  return the_array.find(e => e.wpid == segid);
}