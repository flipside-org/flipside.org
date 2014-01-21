---
layout: note
notes_active : true
filters: guide

title: Processing data for Open Spending
category: note
image: open-spending-log.png
tags: open-data spending

user: danielfdsilva
---

[Open Spending](https://openspending.org/) is a project from the Open Knowledge Foundation that aims to map financial transactions from governments around the world. This post describes how we added over [380.000](https://openspending.org/pt_ajustes-diretos/) non-bid contracts from the Portuguese government to openspending.

Even though the data on non-bid expenditures from the Portuguese government is already publicly available on [Base.gov.pt](http://www.base.gov.pt), the data on Open Spending is much more accessible. People can explore and browse the set in the browser, or use the API to create visualizations or other insights.

## Processing the data
To prepare the data for import, we use python to process a file with one JSON document per line and turn it into a CSV. The most important things the scripts handles, are:

- all dates are formatted to `yyyy-mm-dd`;
- whenever the `signing date` is empty, the field is populated with the `publication date`. Openspending discards any row with empty calls;
- the fields containing amounts are stripped from Euro sign and the thousand separator. The decimal mark is set to `.`;
- the CPV code is split from its description;
- multiple locations are split with a pipe; and
- multiple contracting or contracted entities are combined in one new entity.

### Multiple contracting or contracted entities
Open Spending doesn't support multiple contracting or contracted entities for one record. The format used for importing is csv and since it has a flat structure it doesn't allow multidimensional values.  
To solve this problem we have two options:
- split the contracting and contracted entities creating a contract for each one and dividing the total amount by the number of entities. This would lead to several duplicate contracts and erroneous amounts since not every contracted company will be paid the same.
- keep one single contract and merge the entities. The problem with this approach is that analysis of relationships between entities become more difficult.  

We chose the latter approach so the contract maintains its integrity. Users that want to further analyse the dataset, will always be able to preprocess the data and split entities before doing so.

You can check the code for yourself on the processors' Github [repository](https://github.com/flipside-org/ajustes-processor).

## Creating the model 
Besides preparing the CSV file for import, Open Spending also requires people to create a model for the dataset. We decided to add as much information as possible, even though we were forced to leave out some potentially interesting data regarding amounts actually spent. Since not all contracts contain these amounts and Open Spending discards rows with empty dates or floats, we decided to not include them in the model just yet. Check the model on [openspending.org](https://openspending.org/pt_ajustes-diretos/model.json).
