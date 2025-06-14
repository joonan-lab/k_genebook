---
layout: default
title: K-GeneBook Table
---

{% include navbar.html %}

# K-GeneBook: 한국인 ASD 유전자 우선순위

한국인 자폐증(ASD) 가족 유전체 분석 및 기능 연구 데이터를 기반으로 정리한 유전자 우선순위 테이블입니다.  
각 열의 의미는 아래와 같습니다:

- **gene**: 유전자 이름  
- **ASD_female_qval**: 여성 ASD 환자 기반 유의성 (q-value)  
- **ASD_male_qval**: 남성 ASD 환자 기반 유의성 (q-value)  
- **FDR_TADA_ASD**: Fu 2022 연구의 TADA 기반 ASD FDR  
- **FDR_TADA_DD**: Fu 2022 연구의 TADA 기반 발달장애(DD) FDR  
- **FDR_TADA_NDD**: Fu 2022 연구의 TADA 기반 신경발달장애(NDD) FDR  
- **Mouse, Drosophila, ...**: 각 모델 생물종에서 기능연구가 수행된 경우 관련 PMID. 없으면 `.` 으로 표시됨


{% include gene_table.html %}

<script src="{{ '/assets/js/plot.js' | relative_url }}"></script>
