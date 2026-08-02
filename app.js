(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.SOSWifi = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const SOURCES = {
    unstable: { label: 'TP-Link Brasil — conexão instável', url: 'https://www.tp-link.com/br/support/faq/2237/' },
    missing: { label: 'TP-Link Brasil — rede Wi-Fi não aparece', url: 'https://www.tp-link.com/br/support/faq/2597/' },
    lights: { label: 'TP-Link Brasil — luzes do roteador', url: 'https://www.tp-link.com/br/support/faq/3334/' },
    speed: { label: 'TP-Link Brasil — velocidade do roteador e do acesso', url: 'https://www.tp-link.com/br/support/faq/2435/' },
    anatel: { label: 'Anatel — velocidade da conexão e atendimento', url: 'https://www.gov.br/anatel/pt-br/consumidor/conheca-seus-direitos-2/telefonia-movel/velocidade-de-conexao-a-internet' }
  };

  const CASES = {
    allOffline: {
      title: 'Todos conectam ao Wi-Fi, mas ninguém acessa a internet', level: 'provedor ou enlace', sources: ['lights', 'unstable'],
      checks: ['Confira no canal oficial do provedor se há indisponibilidade na região.', 'Observe as luzes sem concluir pelo nome: compare cor e padrão com o manual exato do aparelho.', 'Verifique externamente se os cabos de energia e da porta Internet/WAN estão firmes e sem dano.', 'Reinicie modem e roteador somente na ordem indicada pelo provedor ou pelos manuais; não pressione o botão de reset.'],
      test: 'Teste novamente em dois aparelhos. Se todos continuam sem internet, registre horário, luzes observadas e protocolo do provedor.',
      avoid: 'Não altere DNS, modo de operação, usuário da conexão ou endereço de rede antes de excluir indisponibilidade do provedor.'
    },
    wifiOnly: {
      title: 'A conexão por cabo funciona, mas o Wi-Fi falha', level: 'rede sem fio', sources: ['missing', 'unstable'],
      checks: ['Teste um aparelho perto do roteador e outro que já funcionava nessa rede.', 'Confirme no manual se a função Wi-Fi e suas luzes estão ativas; alguns modelos têm botão físico.', 'Afaste o equipamento de objetos que bloqueiem ventilação e de fontes evidentes de interferência.', 'Reinicie pelo procedimento do modelo e mantenha nome, senha, canal e largura atuais durante o primeiro teste.'],
      test: 'Compare o mesmo aparelho perto e longe do roteador. Anote se a rede some, desconecta ou apenas perde velocidade.',
      avoid: 'Não mude vários canais, bandas e larguras ao mesmo tempo; isso impede saber o que alterou o resultado.'
    },
    oneDevice: {
      title: 'Só um celular ou computador apresenta o problema', level: 'aparelho específico', sources: ['missing'],
      checks: ['Confirme que outros aparelhos acessam a mesma rede no mesmo local.', 'Desative e reative o Wi-Fi do aparelho e reinicie-o antes de mudar o roteador.', 'Confira modo avião, economia de energia, atualização do sistema e data/hora do aparelho.', 'Se você conhece a senha, remova a rede salva e conecte novamente; isso apaga configurações guardadas apenas naquele aparelho.'],
      test: 'Teste o aparelho em outra rede conhecida e teste outro aparelho na rede de casa. Essa comparação localiza melhor a falha.',
      avoid: 'Não restaure o roteador inteiro por causa de um único aparelho sem testar o próprio dispositivo.'
    },
    weakRoom: {
      title: 'O sinal fica fraco ou cai em parte da casa', level: 'alcance e obstáculos', sources: ['speed', 'unstable'],
      checks: ['Teste no mesmo aparelho a poucos metros do roteador e depois no local problemático.', 'Mantenha o roteador ventilado, fora de armário fechado e, quando possível, em posição central e desobstruída.', 'Observe paredes densas, espelhos, estruturas metálicas e equipamentos próximos entre os dois pontos.', 'Consulte o manual sobre as bandas disponíveis; alcance e velocidade negociada variam com aparelho, distância e interferência.'],
      test: 'Faça três medições em posições fixas, sem mover o roteador durante a comparação. Registre local e horário.',
      avoid: 'Não compre repetidor ou troque o plano antes de confirmar que o problema é de cobertura, não do acesso do provedor.'
    },
    unstableAll: {
      title: 'A internet cai em vários aparelhos', level: 'instabilidade geral', sources: ['unstable', 'anatel'],
      checks: ['Anote horário e duração das quedas e se as luzes mudam.', 'Compare, se disponível, um aparelho por cabo e um por Wi-Fi durante a mesma queda.', 'Verifique cabos externos e fonte de alimentação sem abrir o equipamento ou usar fonte incompatível.', 'Consulte indisponibilidade e abra protocolo no provedor antes de alterar configurações avançadas.'],
      test: 'Informe ao suporte se a falha atinge cabo e Wi-Fi, quantos aparelhos foram testados e o padrão das luzes.',
      avoid: 'Não reinicie repetidamente nem faça reset de fábrica: isso apaga evidências e pode remover a configuração do provedor.'
    },
    networkMissing: {
      title: 'O nome da rede Wi-Fi não aparece', level: 'emissão ou compatibilidade', sources: ['missing', 'lights'],
      checks: ['Veja se a rede aparece em outro aparelho perto do roteador.', 'Confirme que o Wi-Fi do aparelho está ativo e que modo avião está desligado.', 'Compare o estado da luz ou botão Wi-Fi com o manual do modelo.', 'Reinicie pelo procedimento oficial e confira se o aparelho suporta a banda configurada antes de alterar qualquer opção.'],
      test: 'Se nenhum aparelho encontra a rede, registre luzes e modelo para o suporte. Se só um não encontra, trate como falha do aparelho.',
      avoid: 'Não exponha senha, etiqueta, endereço de administração ou número de série em fóruns públicos.'
    },
    slow: {
      title: 'A conexão funciona, mas parece lenta', level: 'medição comparável', sources: ['speed', 'anatel'],
      checks: ['Pause downloads, nuvem, streaming e atualizações nos aparelhos usados no teste.', 'Teste perto do roteador e, se possível, também por cabo compatível, usando o mesmo servidor e horário aproximado.', 'Diferencie taxa do Wi-Fi, capacidade das portas e velocidade entregue pelo provedor: são números distintos.', 'Repita a medição em mais de um horário e guarde resultados e protocolo antes de reclamar.'],
      test: 'Compare cabo × Wi-Fi e perto × longe. Um teste isolado não representa sozinho a qualidade do serviço.',
      avoid: 'Não conclua que o plano está errado usando apenas o número anunciado na caixa do roteador.'
    },
    restarts: {
      title: 'Roteador reinicia, aquece ou apaga sozinho', level: 'alimentação ou equipamento', sources: ['lights'],
      checks: ['Pare de usar se houver cheiro, fumaça, faísca, líquido, tomada frouxa, cabo danificado ou calor anormal.', 'Mantenha as aberturas livres e o equipamento na posição prevista pelo fabricante.', 'Use somente a fonte especificada para o modelo; tensão igual não garante compatibilidade completa.', 'Anote quais luzes apagam e se ocorre sob carga, mas não abra a fonte ou o roteador.'],
      test: 'Sem sinais de risco, consulte o suporte com modelo, fonte usada, padrão das luzes e frequência das reinicializações.',
      avoid: 'Não cubra, não improvise ventilação interna e não teste outra fonte sem confirmar todas as especificações e polaridade.'
    }
  };

  const RISK = {
    title: 'Há sinal de risco: interrompa os testes', level: 'parada', sources: ['lights'],
    checks: ['Desligue da tomada somente se isso puder ser feito sem contato com líquido, faísca ou parte danificada.', 'Afaste pessoas e materiais combustíveis do equipamento.', 'Não toque, não abra, não cheire de perto e não religue para confirmar o defeito.', 'Acione o provedor ou a assistência do fabricante; em risco imediato, use o serviço de emergência adequado.'],
    test: 'Nenhum teste adicional é indicado enquanto houver sinal de risco.',
    avoid: 'Não use outra fonte, extensão, adaptador ou peça improvisada.'
  };

  function escapeHtml(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]; }); }
  function getPlan(symptom, hasRisk) { return hasRisk ? RISK : CASES[symptom] || null; }
  function renderPlan(plan) {
    if (!plan) return '<p class="message">Selecione um sintoma válido.</p>';
    const sourceLinks = plan.sources.map(function (id) { const source = SOURCES[id]; return '<a href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener">' + escapeHtml(source.label) + '</a>'; }).join(' · ');
    return '<section class="result ' + (plan.level === 'parada' ? 'stop' : '') + '"><div class="result-head"><div><p class="eyebrow">' + (plan.level === 'parada' ? 'PARE' : 'ROTA DE TRIAGEM') + '</p><h2>' + escapeHtml(plan.title) + '</h2></div><span>' + escapeHtml(plan.level) + '</span></div><ol>' + plan.checks.map(function (step) { return '<li>' + escapeHtml(step) + '</li>'; }).join('') + '</ol><div class="next"><div><strong>Como comparar</strong><p>' + escapeHtml(plan.test) + '</p></div><div><strong>Evite</strong><p>' + escapeHtml(plan.avoid) + '</p></div></div><p class="based">Fontes desta rota: ' + sourceLinks + '. O manual e o suporte do seu modelo prevalecem.</p></section>';
  }
  function renderApp(doc) {
    const form = doc.getElementById('triageForm');
    if (!form) return;
    const result = doc.getElementById('result');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const plan = getPlan(doc.getElementById('symptom').value, doc.getElementById('risk').value === 'yes');
      result.innerHTML = renderPlan(plan);
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  if (typeof document !== 'undefined') renderApp(document);
  return { SOURCES, CASES, RISK, escapeHtml, getPlan, renderPlan, renderApp };
});
