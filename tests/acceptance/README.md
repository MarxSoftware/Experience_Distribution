# Test setup

## Segments

### home_visitor
```
segment().site("test_site").and(rule(PAGEVIEW).page("page#home").count(2));
```

### demo_score
```
segment().site("test_site").and(rule(SCORE).name("demo").score(100));
```