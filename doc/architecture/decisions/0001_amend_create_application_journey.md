# 1. Amend create application journey

Date: 2024-11-28

## Status

Accepted

## Context

Whilst there is a lot of overlap between CAS2 HDC and CAS2 Bail, these two categories need to be handled separately, which is why CAS2 Bail is being developed as its own service. We also need to be able to distinguish between Court Bail and Prison Bail applications. This means that we need to ensure that our start application journey allows for clear distinction between these three application categories.

## Decision

We will add a page at the start of the application journey to confirm whether the application is for HDC, Court Bail or Prison Bail.

* if it is for HDC, we will redirect the user to the CAS2 HDC service

* if it is for Court Bail or Prison Bail, the user will continue in our service, and will be asked to provide either the person's prison number or CRN. We will also add a query parameter to the URL specifying whether the application is for Court Bail or Prison Bail, which we will later persist on the application.

If the person has neither a prison number nor a CRN, we will inform the user that an application cannot be made through CAS2, and that they should first create an nDelius record.

Assuming a prison number or CRN is provided, we will load the person's data as in the HDC service, and then allow the user to confirm and save the application. This will be the same process as in HDC, although we will also persist the application type as specified in the query parameter.

## Consequences

We will easily be able to distinguish between Court Bail and Prison Bail applications, within the service or for reporting. This will allow us to use the same digital service for Court Bail and Prison Bail, where most of the application questions are the same.