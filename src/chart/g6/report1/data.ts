export default {
  nodes: [
    {
      id: "科兴制药",
      label: "科兴制药（688136）",
    },
    {
      id: "海外布局",
      label: "海外布局",
    },
    {
      id: "新兴市场准入",
      label: "新兴市场准入",
    },
    {
      id: "产品引入",
      label: "产品引入",
    },
    {
      id: "白蛋白紫杉醇",
      label: "白蛋白紫杉醇",
    },
    {
      id: "传统业务板块",
      label: "传统业务板块",
    },
    {
      id: "营业收入",
      label: "营业收入",
    },
    {
      id: "归母净利润",
      label: "归母净利润",
    },
    {
      id: "PS法估值",
      label: "PS法估值",
    },
    {
      id: "风险提示",
      label: "风险提示",
    },
    {
      id: "行业政策风险",
      label: "行业政策风险",
    },
    {
      id: "外汇汇率风险",
      label: "外汇及汇率风险",
    },
    {
      id: "药物迭代风险",
      label: "药物迭代风险",
    },
    {
      id: "药品研发失败风险",
      label: "药品研发失败风险",
    },
    {
      id: "主观假设风险",
      label: "主观假设风险",
    },
  ],
  edges: [
    {
      source: "科兴制药",
      target: "海外布局",
      label: "正向影响",
      description: "公司通过海外布局提升全球市场竞争力，增加收入来源。",
    },
    {
      source: "海外布局",
      target: "新兴市场准入",
      label: "正向影响",
      description: "新兴市场的准入有助于公司产品销售和市场扩张。",
    },
    {
      source: "海外布局",
      target: "产品引入",
      label: "正向影响",
      description: "引入新产品丰富公司产品线，增强市场竞争力。",
    },
    {
      source: "产品引入",
      target: "白蛋白紫杉醇",
      label: "正向影响",
      description: "白蛋白紫杉醇的市场短缺为公司带来销售机遇。",
    },
    {
      source: "科兴制药",
      target: "传统业务板块",
      label: "正向影响",
      description: "传统业务板块提供稳定现金流，支持公司持续发展。",
    },
    {
      source: "传统业务板块",
      target: "营业收入",
      label: "正向影响",
      description: "核心产品在细分市场的领先地位带动营业收入增长。",
    },
    {
      source: "营业收入",
      target: "归母净利润",
      label: "正向影响",
      description: "营业收入的增长直接影响公司的净利润。",
    },
    {
      source: "归母净利润",
      target: "PS法估值",
      label: "正向影响",
      description: "净利润的改善提升公司估值。",
    },
    {
      source: "PS法估值",
      target: "科兴制药",
      label: "正向影响",
      description: "估值提升支持公司股票的买入评级。",
    },
    {
      source: "风险提示",
      target: "科兴制药",
      label: "反向影响",
      description: "风险提示为投资者提供潜在风险，可能影响投资决策。",
    },
    {
      source: "行业政策风险",
      target: "风险提示",
      label: "反向影响",
      description: "行业政策变动可能对公司运营产生不利影响。",
    },
    {
      source: "外汇汇率风险",
      target: "风险提示",
      label: "反向影响",
      description: "外汇汇率波动可能影响公司的海外收入和成本。",
    },
    {
      source: "药物迭代风险",
      target: "风险提示",
      label: "反向影响",
      description: "新药物的出现可能使现有产品失去市场竞争力。",
    },
    {
      source: "药品研发失败风险",
      target: "风险提示",
      label: "反向影响",
      description: "药品研发失败可能导致公司投入的资金和资源损失。",
    },
    {
      source: "主观假设风险",
      target: "风险提示",
      label: "反向影响",
      description: "研报中的预测基于某些假设，这些假设可能与实际情况不符。",
    },
  ],
};
