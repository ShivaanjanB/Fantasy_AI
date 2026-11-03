# Liability, Learning and Mule Accounts: How the UK's Mandatory Reimbursement Regime Is Reshaping Fraud Detection in Instant Payments

**Applicant:** Shivaanjan Bhattacharjee
**Programme:** PhD Business and Management (Information Systems / FinTech), Alliance Manchester Business School. *[Confirm which programme the supervisor admits through; switch to PhD Accounting and Finance if advised.]*
**Proposed supervisor:** Professor Markos Zachariadis *[or Dr Andrea Lagna; confirm before submitting]*
**Funding sought:** AMBS School Studentship (2027 entry)
**Word count:** ~3,000 excluding references

> **Before you submit:** this is a draft for you to rewrite in your own voice. Check every factual claim marked *[verify]* against the cited source, and put the real titles of your own papers where shown. Don't submit wording you can't defend in an interview.

---

## 1. Introduction and motivation

Real-time payments have made moving money cheaper and faster. They have also made fraud faster. In the UK, authorised push payment (APP) fraud is one of the largest categories of payment fraud reported by UK Finance. In APP fraud, a victim is manipulated into sending money from their own account to an account controlled by a criminal. Losses run to hundreds of millions of pounds a year *[verify latest UK Finance Annual Fraud Report figure]*. Unlike card fraud, the payer authorises the transaction, and Faster Payments settle within seconds. Detection therefore cannot rely on chargebacks, and money is usually dispersed through networks of "money mule" accounts before anyone notices.

In October 2024 the Payment Systems Regulator (PSR) introduced a mandatory reimbursement requirement for APP fraud over Faster Payments (PS23/3). Most victims must now be reimbursed, up to a maximum of £85,000, and the cost is split equally between the **sending** and the **receiving** payment service provider (PSP) *[verify current parameters]*. This changes the economics of fraud prevention. Previously the receiving institution, which opens and runs the mule account, bore almost none of the cost of the fraud it enabled. Now it bears half. In incentive terms, the regulator has moved part of the liability onto the party best placed to observe mule behaviour (Holmström, 1979).

This is a natural experiment at the meeting point of information systems, finance and regulation. It raises a question the literature has not yet answered: **when liability for fraud is reallocated, do financial institutions change *what* they learn and *where* they look, and with what effect on fraud outcomes and on legitimate customers?**

## 2. Research aims and questions

The overall aim is to explain how a change in liability affects the design, deployment and outcomes of machine-learning fraud-detection systems in instant payments. I propose three linked research questions:

- **RQ1 (Outcomes).** Did the 2024 reimbursement regime change APP fraud outcomes, such as fraud rates and money sent to and received by mule accounts, differently for institutions that were mostly net *receivers* of fraudulent funds compared with those that were mostly net *senders*?
- **RQ2 (Detection design).** How should a receiving institution detect mule accounts when labels are scarce, delayed and adversarial? How do graph-based and explainable models perform compared with transaction-level classifiers under realistic cost assumptions?
- **RQ3 (Organisational adoption).** How have banks and fintechs reorganised their fraud-detection work since the regime began? This covers data sharing, model governance, explainability requirements and customer friction.

## 3. Literature and positioning

**Fraud detection as a learning problem.** Statistical fraud detection has a long history (Bolton & Hand, 2002). Machine learning has made it routine, but several problems remain open: extreme class imbalance, concept drift as fraudsters adapt, and labels that arrive late and only for the cases an institution investigates (Dal Pozzolo et al., 2018). Most published work studies card fraud from the **sender's** side, because public datasets are mostly card or simulated mobile-money transactions (Lopez-Rojas et al., 2016). Much less work examines the **receiving** institution's problem: spotting accounts that are being used to collect and pass on stolen funds. Graph-based approaches from anti-money laundering are a promising bridge (Weber et al., 2019), and realistic synthetic transaction data has recently made such work more reproducible (Altman et al., 2023).

**Explainability and governance.** Fraud decisions block payments and freeze accounts, so institutions must justify them to customers, ombudsmen and regulators. Post-hoc explanation methods such as SHAP (Lundberg & Lee, 2017) are widely used. There is little evidence on whether explanations actually change analyst decisions, or how accurate a model can be while staying explainable in a high-stakes, adversarial setting.

**FinTech, infrastructure and governance.** Research in information systems and FinTech has shown that payment infrastructures are socio-technical systems: their governance, standards and incentives shape innovation (Zachariadis & Ozcan, 2017; Zachariadis, Hileman & Scott, 2019). The finance literature treats technology as a way to cut the cost of financial intermediation (Philippon, 2016). Research on the economics of cybercrime shows that who bears losses shapes how much institutions spend on security (Anderson et al., 2013).

**Gap.** These literatures rarely meet. Fraud-detection research tends to treat incentives as fixed. Regulation and economics research treats detection technology as a black box. Information systems research on payment infrastructures has given less attention to fraud. This project combines all three. It treats a regulatory change in liability as an *exogenous shock* to institutions' incentives and studies how it changes detection systems and outcomes.

## 4. Methodology

The project uses a mixed-methods design of three studies, each answering one research question. This design suits a three-to-four-year PhD and produces separate papers.

### Study 1: Did liability reallocation change fraud outcomes? (RQ1)

*Data.* The PSR publishes firm-level APP scam performance data, including reimbursement rates and money sent and received per unit of transaction volume for the largest PSPs and a wider set of firms *[verify current coverage and publication schedule]*. I will build a panel combining these releases with UK Finance aggregate fraud statistics and public firm characteristics such as size, business model, and whether the firm is a challenger or incumbent.

*Design.* The regime affects all firms at once, but exposure differs. Firms that historically **received** a large share of fraudulent funds, often fast-onboarding digital banks and e-money institutions, took on much more new liability than firms that mostly sent. I will use this pre-regime exposure as a treatment intensity in a difference-in-differences design and test for differential changes in fraud received after October 2024. Where firms entered the reporting set at different times, I will use estimators that are robust to staggered and heterogeneous treatment effects (Callaway & Sant'Anna, 2021). Robustness checks will include placebo dates, alternative exposure measures and checks on whether firms changed how they report.

*Limitations.* Firm-level public data is coarse. Study 1 is therefore an aggregate test of the incentive mechanism, and Studies 2 and 3 open the black box.

### Study 2: Detecting mule accounts under realistic constraints (RQ2)

*Data.* I will begin with open and synthetic data so the work is reproducible: IBM's synthetic AML transaction datasets (Altman et al., 2023), PaySim (Lopez-Rojas et al., 2016) and the Elliptic transaction graph (Weber et al., 2019). Alongside this, I will seek anonymised data or secure-environment access through the AMBS Centre for FinTech Studies' industry partners *[confirm with supervisor whether such access is realistic]*. I don't assume this access in the design. The study can be completed on public and synthetic data alone.

*Methods.* I will compare three model families for **receiving-side** detection:
1. Transaction-level gradient-boosted classifiers, the industry baseline.
2. Account-level models using behavioural features such as inbound and outbound velocity, fan-in and fan-out, and account age.
3. Graph neural networks over the transaction network.

The evaluation will reflect real operations:
- **Delayed and selective labels:** a fraud case is labelled only after a victim complains.
- **Concept drift:** models will be trained and tested on rolling, time-ordered splits.
- **Cost-sensitive metrics:** each model will be scored on the expected reimbursement cost it avoids, net of the cost of blocking legitimate customers, using the regime's actual 50:50 liability split, rather than on accuracy alone.

I will then measure how much predictive performance is lost by constraining models to be explainable. For example, I will compare monotonic or sparse models with black-box models plus SHAP explanations (Lundberg & Lee, 2017).

*Contribution.* A transparent, cost-aligned benchmark for receiving-side fraud detection, an area that has received relatively little study, and evidence on what explainability costs in accuracy under a real liability regime.

### Study 3: How institutions reorganised (RQ3)

*Design.* A qualitative multiple-case study (Eisenhardt, 1989) of roughly 15–25 semi-structured interviews with fraud, risk and data-science staff at UK banks, digital banks, payment institutions and vendors. I will also analyse documents such as PSR consultation responses, industry guidance and published firm statements. Interviews will cover:
- how institutions changed detection priorities after 2024;
- data-sharing arrangements, such as intelligence sharing between sending and receiving firms;
- model governance and explainability requirements;
- the trade-off between friction and fraud, especially for vulnerable customers.

*Access.* I will recruit through AMBS's industry links and FinTech networks, and through professional contacts. The required number of interviews is modest and can be reached even if response rates are low.

*Analysis.* Thematic coding, iterating between data and theory, to build a model of how a change in liability travels through an organisation into the design of its detection systems.

### Integration

Study 1 asks *whether* outcomes changed, Study 2 asks *what is technically possible* for the newly liable party, and Study 3 asks *how* institutions actually responded. Together they give a full account of the effects of the regime, from the regulation itself to the models and the organisations that run them.

## 5. Expected contributions

- **Theory.** Linking incentive theory (who bears losses) with information systems research on payment infrastructures, to explain how changes in liability reshape the design of algorithmic systems.
- **Methods.** A reproducible, cost-aligned evaluation framework for receiving-side mule detection under delayed labels and drift.
- **Policy and practice.** Evidence for the PSR and FCA, and for firms, on whether a shared-liability regime works, who it burdens, and what detection designs best match it. This is timely as the PSR's functions move into the FCA and other jurisdictions consider similar regimes *[verify current status of PSR–FCA consolidation and international comparators, e.g. EU Payment Services Regulation negotiations]*.

## 6. Fit with AMBS and the proposed supervisor

AMBS's **Centre for Financial Technology (FinTech) Studies**, led by Professor Markos Zachariadis, studies payment infrastructures, open banking and the governance of financial technology. This project extends that work into fraud and liability. It also draws on AMBS strengths in finance and in management science and analytics for the empirical and modelling components. *[Personalise: cite one or two of the supervisor's recent papers you have actually read, and say specifically how this project builds on them.]*

## 7. Preparedness

My MSc in Financial Technology at the University of Warwick (2025–26) trained me in financial data analytics, risk management and machine learning. Through coursework projects I built a credit-default classifier and anomaly-detection models for fraudulent transactions, and I designed a blockchain-based payment prototype. Before that I completed a BBA in Data Analytics and Finance at Jain University, graduating at the top of my final year with a CGPA of 9.475/10. I have published two papers on taxation systems and co-authored a paper on AI and hashing in payment-gateway security *[insert full titles and venues]*. Through these I have experience of the full research cycle and of payment-security problems in particular. I work fluently in Python (pandas, scikit-learn), SQL and R. My GRE score is 338/340. *[Add your MSc dissertation topic and any graph or deep-learning experience. Note gaps you'll close in year 1, e.g. econometrics for Study 1 and qualitative methods training for Study 3.]*

## 8. Ethics and data management

Study 3 needs University ethics approval. Interviewees will be anonymised and firms will not be identified without consent. Industry data, if obtained, will be used only in secure environments under a data-sharing agreement, and no personal data will leave the provider. Code and synthetic-data experiments will be made openly available.

## 9. Timeline (3.5 years)

| Period | Activities |
|---|---|
| Year 1 | Research training (econometrics, ML, qualitative methods); systematic literature review; build the PSR/UK Finance panel; start the Study 2 benchmark on public and synthetic data; ethics approval |
| Year 2 | Complete Study 1 and draft paper 1; complete core Study 2 models; begin interviews |
| Year 3 | Finish interviews and Study 3 analysis; draft papers 2 and 3; conference presentations (e.g. ICIS, ECIS, FMA/EFA FinTech sessions) |
| Final 6 months | Integrate findings; write up and submit thesis |

---

## References

Altman, E., Blanuša, J., von Niederhäusern, L., Egressy, B., Anghel, A. & Atasu, K. (2023). Realistic synthetic financial transactions for anti-money laundering models. *Advances in Neural Information Processing Systems 36 (Datasets and Benchmarks Track).*

Anderson, R., Barton, C., Böhme, R., Clayton, R., van Eeten, M., Levi, M., Moore, T. & Savage, S. (2013). Measuring the cost of cybercrime. In R. Böhme (Ed.), *The Economics of Information Security and Privacy* (pp. 265–300). Springer.

Bolton, R. J. & Hand, D. J. (2002). Statistical fraud detection: A review. *Statistical Science, 17*(3), 235–255.

Callaway, B. & Sant'Anna, P. H. C. (2021). Difference-in-differences with multiple time periods. *Journal of Econometrics, 225*(2), 200–230.

Dal Pozzolo, A., Boracchi, G., Caelen, O., Alippi, C. & Bontempi, G. (2018). Credit card fraud detection: A realistic modeling and a novel learning strategy. *IEEE Transactions on Neural Networks and Learning Systems, 29*(8), 3784–3797.

Eisenhardt, K. M. (1989). Building theories from case study research. *Academy of Management Review, 14*(4), 532–550.

Holmström, B. (1979). Moral hazard and observability. *Bell Journal of Economics, 10*(1), 74–91.

Lopez-Rojas, E. A., Elmir, A. & Axelsson, S. (2016). PaySim: A financial mobile money simulator for fraud detection. *Proceedings of the 28th European Modeling and Simulation Symposium (EMSS).*

Lundberg, S. M. & Lee, S.-I. (2017). A unified approach to interpreting model predictions. *Advances in Neural Information Processing Systems 30.*

Payment Systems Regulator (2023). *PS23/3: Fighting authorised push payment fraud: a new reimbursement requirement.* London: PSR.

Philippon, T. (2016). The FinTech opportunity. *NBER Working Paper No. 22476.*

UK Finance (latest). *Annual Fraud Report.* London: UK Finance. *[cite the specific year used]*

Weber, M., Domeniconi, G., Chen, J., Weidele, D. K. I., Bellei, C., Robinson, T. & Leiserson, C. E. (2019). Anti-money laundering in Bitcoin: Experimenting with graph convolutional networks for financial forensics. *KDD Workshop on Anomaly Detection in Finance.*

Zachariadis, M., Hileman, G. & Scott, S. V. (2019). Governance and control in distributed ledgers: Understanding the challenges facing blockchain technology in financial services. *Information and Organization, 29*(2), 105–117.

Zachariadis, M. & Ozcan, P. (2017). The API economy and digital transformation in financial services: The case of open banking. *SWIFT Institute Working Paper No. 2016-001.*
