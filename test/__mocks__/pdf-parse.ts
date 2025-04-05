const pdfParse = jest.fn(async (_buffer: Buffer) => {
    return {
        numpages: 1,
        numrender: 1,
        info: {
          PDFFormatVersion: '1.3',
          IsAcroFormPresent: false,
          IsXFAPresent: false,
          Author: 'U_PO_SOA_AGV',
          Creator: 'Form ZFAT_ISUBILL_BT PT',
          Producer: 'SAP NetWeaver 731 ',
          CreationDate: 'D:20240125123342'
        },
        metadata: null,
        text: '\n' +
          '\n' +
          'Valores Faturados\n' +
          'Itens da FaturaUnid.Quant.Preço UnitValor (R$) PIS/COFINSBase Calc.Aliq.ICMSTarifa Unit.\n' +
          'ICMSICMS\n' +
          'Energia ElétricakWh     100  0,95543124        95,52 0,74906000 \n' +
          'Energia SCEE s/ ICMSkWh   2.300  0,50970610     1.172,31 0,48733000 \n' +
          'Energia compensada GD IkWh   2.300  0,48733000    -1.120,85 0,48733000 \n' +
          'Contrib Ilum Publica Municipal         40,45\n' +
          'Ressarcimento de Danos       -120,81\n' +
          'TOTAL         66,62\n' +
          'Histórico de Consumo\n' +
          'MÊS/ANOCons. kWhMédia kWh/DiaDias\n' +
          'JAN/24   2.400     72,72   33\n' +
          'DEZ/23   2.280     81,42   28\n' +
          'NOV/23   2.360     78,66   30\n' +
          'OUT/23   2.880     87,27   33\n' +
          'SET/23   1.520     52,41   29\n' +
          'AGO/23   1.520     46,06   33\n' +
          'JUL/23     320     21,33   15\n' +
          'JUN/23       0      0,00    0\n' +
          'MAI/23       0      0,00    0\n' +
          'ABR/23       0      0,00    0\n' +
          'MAR/23       0      0,00    0\n' +
          'FEV/23       0      0,00    0\n' +
          'JAN/23       0      0,00    0\n' +
          'Reservado ao Fisco\n' +
          'SEM VALOR FISCAL\n' +
          'Base de cálculo (R$)Alíquota (%)Valor (R$)\n' +
          'Fale com CEMIG: 116 - CEMIG Torpedo 29810 - Ouvidoria CEMIG: 0800 728 3838 - Agência Nacional de Energia Elétrica - ANEEL - Telefone: 167 - Ligação gratuita de telefones fixos e móveis.\n' +
          'Código de Débito AutomáticoInstalaçãoVencimentoTotal a pagar\n' +
          '008128696724300142276209/02/2024R$66,62\n' +
          'Janeiro/202483670000000-0 66620138002-7 91607372233-9 08128696724-5\n' +
          'ATENÇÃO:\n' +
          'DÉBITO AUTOMÁTICO\n' +
          'SELFWAY TREINAMENTO PERSONALIZADO LTDA\n' +
          'AV BANDEIRANTES 1586 CS\n' +
          'COMITECO\n' +
          '30315-032 BELO HORIZONTE, MG\n' +
          'CNPJ 31.176.0**/****-**\n' +
          '        Nº DO CLIENTE                      Nº DA INSTALAÇÃO\n' +
          '  7202210726        3001422762\n' +
          '         Referente a                                Vencimento                       Valor a pagar (R$)\n' +
          '    JAN/2024               09/02/2024               66,62 \n' +
          'NOTA FISCAL Nº 113443542 - SÉRIE 000\n' +
          'Data de emissão: 23/01/2024\n' +
          'Consulte pela chave de acesso em:\n' +
          'http://www.sped.fazenda.mg.gov.br/spedmg/nf3e\n' +
          'chave de acesso:\n' +
          '31240106981180000116660001134435421093514577\n' +
          'Protocolo de autorização: 1312400124189531\n' +
          '24.01.2024 às 02:16:37\n' +
          'ClasseSubclasseModalidade TarifáriaDatas de Leitura\n' +
          'Comercial Outros serviços Convencional B3AnteriorAtualNº de diasPróxima\n' +
          'Trifásico e outras atividades20/1222/01 3319/02\n' +
          'Informações Técnicas\n' +
          'Tipo de MediçãoMediçãoLeituraLeituraConstanteConsumo kWh\n' +
          'AnteriorAtualde Multiplicação\n' +
          'Energia kWhBPC228203359378438402.400    \n' +
          ' \n' +
          'DOCUMENTO AUXILIAR DA NOTA FISCAL DE ENERGIA ELÉTRICA ELETRÔNICASEGUNDA VIA\n' +
          'CEMIG DISTRIBUIÇÃO S.A. CNPJ 06.981.180/0001-16 / INSC. ESTADUAL 062.322136.0087.\n' +
          'AV. BARBACENA, 1200 - 17° ANDAR - ALA 1 - BAIRRO SANTO AGOSTINHO\n' +
          'CEP: 30190-131 - BELO HORIZONTE - MG.TARIFA SOCIAL DE ENERGIA ELÉTRICA - TSEE FOI CRIADA PELA LEI Nº 10.438, DE 26 DE ABRIL DE 2002\n' +
          'Informações Gerais\n' +
          'SALDO ATUAL DE GERAÇÃO: 1.212,00 kWh. Tarifa vigente conforme Res Aneel nº 3.202, de 23/05/2023.\n' +
          'Redução aliquota ICMS conforme Lei Complementar 194/22. Considerar nota fiscal quitada após débito em\n' +
          'sua c/c. Unidade faz parte de sistema de compensação de energia. O pagamento desta conta não quita\n' +
          'débitos anteriores. Para estes, estão sujeitas penalidades legais vigentes (multas) e/ou atualização financeira\n' +
          '(juros)baseadas no vencimento das mesmas. Leitura realizada conforme calendário de faturamento. É dever\n' +
          'do consumidor manter os dados cadastrais sempre atualizados e informar alterações da atividade exercida no\n' +
          'local.   DEZ/23 Band. Verde - JAN/24 Band. Verde.\n' +
          '  ',
        version: '1.10.100'
      };
  });
  
  export default pdfParse;
  