const puppeteer = require('puppeteer');
const unirest = require('unirest');

//const API_KEY = "aullc00kvuh16heludqmj9hcou"
const API_KEY = "t2mvrakptcfiak2f4akdvbkilu"
const WEBTOOLS_URL = "http://dev.local:8080"
const SEGMENT = {
  name: "home_visitor",
  externalId: 1,
  dsl: 'segment().site("test_site").and(rule(PAGEVIEW).page("page#home").count(2));',
  active: true
};

jest.setTimeout(10000);

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
  var url = 'http://dev.local:2015/rule_page-view.html'

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
          console.log(JSON.stringify(response.body));
          let segment = get_segment(response.body.user.actionSystem.segments, 1)
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
          console.log(JSON.stringify(response.body));
          let segment = get_segment(response.body.user.actionSystem.segments, 1)
          expect(segment.wpid).toBe(1);
          done()
        });
    }, 5000);
  });
})

function get_segment (the_array, segid) {
  return the_array.find(e => e.wpid == segid);
}