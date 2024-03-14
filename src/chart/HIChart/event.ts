import { log } from "console";

const events = [
  {
    id: "event-1",
    type: "收购",
    source: "company-123",
    target: "company-456",
  },
  {
    id: "event-2",
    type: "资产重组",
    children: [
      {
        id: "event-3",
        type: "出售",
        source: "company-123",
        target: "company-456",
        item: "房产",
        value: "1000000000",
      },
      {
        id: "event-4",
        type: "转让",
        source: "company-789",
        target: "company-456",
        item: "股权",
        value: "1000000000",
      },
    ],
  },
];

log(events);

const features = [
  {
    field: "year",
    type: "time",
  },
  {
    field: "marketValue",
    type: "rank",
  },
];

log(features);
