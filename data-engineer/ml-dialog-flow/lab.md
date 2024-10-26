## Create Model
```sql
CREATE OR REPLACE MODEL `helpdesk.predict_eta_v0`
OPTIONS(model_type='linear_reg') AS
SELECT
 category,
 resolutiontime as label
FROM
  `helpdesk.issues`
```


```sql
CREATE OR REPLACE MODEL `helpdesk.predict_eta`
OPTIONS(model_type='linear_reg') AS
SELECT
 seniority,
 experience,
 category,
 type,
 resolutiontime as label
FROM
  `helpdesk.issues`
```

## Eval Model
```sql
WITH eval_table AS (
SELECT
 category,
 resolutiontime as label
FROM
  helpdesk.issues
)
SELECT
  *
FROM
  ML.EVALUATE(MODEL helpdesk.predict_eta_v0,
    TABLE eval_table)
```

```sql
WITH eval_table AS (
SELECT
 seniority,
 experience,
 category,
 type,
 resolutiontime as label
FROM
  helpdesk.issues
)
SELECT
  *
FROM
  ML.EVALUATE(MODEL helpdesk.predict_eta,
    TABLE eval_table)
```


## Model Predict
```sql
WITH pred_table AS (
SELECT
  5 as seniority,
  '3-Advanced' as experience,
  'Billing' as category,
  'Request' as type
)
SELECT
  *
FROM
  ML.PREDICT(MODEL `helpdesk.predict_eta`,
    TABLE pred_table)
```