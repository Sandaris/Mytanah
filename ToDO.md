system feature 

main file: open_transaction_data

1. valuation 
- take regression result ( coff )
- user input drop down, for the categorical variable
- each field is choosing the coeficient of the respective option 
eg: terrace coff: 0.45
    apartment : 0.36

    try diff model and see which get best coefficient ( neural network. random forest, Ordinary least squere )

    ( work file need show train test split, hyperparameter tuning)

    take the most opitimized coefficient into the system 
_______________________________________


2. risk factor
- need find avg house price malaysia
- we tried to impute but found a new data

new data introduced: average house price of entire malaysia.

- apply hp filter, hodrick-prescott to feature a new data column ( 1 = high price. 0 = low price )

> hodrick-prescott: go to study how hp filter separate a time-series dataset into two components: a long-term, smooth trend (the growth component) and short-term, cyclical fluctuations (the business cycle).

- then run correlation test to see other time series data got what to do with up and down trend of house prices 

outcome : loan data is not related to house trend  ( hence we try to find other data set )

new data introduced : household debt credit to gdp
new data introduced : gdp of construction , ( the gdp of residential construction data is not suitable, hence take overall construction )

- do hp filter on construction gdp

then we found this

C:\Users\User\Documents\APU\FYP\Codes\FYP_Property\Code\hcr_dependent_variable_inspection.png

- we found gaps in the cycle, tiny stripes between a big trend , so we fix that ( there should be stability in housing up cycle and down cycle)

- train test split, to run regression for identifying current 2026 time is a high price or low price regime, then show inside the website.

- 



