export const roleFeatures = [
  { value: "report.view", label: "Report View" },
  { value: "report.feedback", label: "Report Feedback" },
  { value: "report.approve", label: "Report Approve" },
  { value: "inspectors.view", label: "Inspectors View" },
  { value: "inspectors.invite", label: "Inspectors Invite" },
  { value: "inspectors.write", label: "Inspectors Write" },
  { value: "rmb.view", label: "RMB View" },
  { value: "rmb.invite", label: "RMB Invite" },
  { value: "rmb.write", label: "RMB Write" },
  { value: "roles.view", label: "Roles View" },
  { value: "roles.write", label: "Roles Write" },
];

interface ReportMetaDataItem {
  title: string;
  data: (
    | {
        key: string;
        keyInAPI: string;
        pseudoName?: undefined;
      }
    | {
        key: string;
        pseudoName: string;
        keyInAPI?: undefined;
      }
  )[];
}

export const reportMetaData: ReportMetaDataItem[] = [
  {
    title: "mine name / ID Number",
    data: [
      {
        key: "Mine site number",
        keyInAPI: "minesiteInfo.code",
      },
      {
        key: "Mine site (parameters)",
        pseudoName: "parameters",
      },
      {
        key: "Subsites",
        pseudoName: "subsites",
      },
    ],
  },
  {
    title: "Mine site Operator & Owner",
    data: [
      {
        key: "Mine Site Operator",
        pseudoName: "name-of-mine-site-operator",
      },
      {
        key: "Operator Address",
        pseudoName: "headquarters-address",
      },
      {
        key: "Contact Name",
        pseudoName: "name-of-responsible-operations-manager",
      },
      {
        key: "Contact Number",
        pseudoName: "telephone-number-2",
      },
      {
        key: "National or Other ID number of operator",
        pseudoName: "id-of-responsible-operations-manager",
      },
      {
        key: "Owner Name (if different from Operator)",
        pseudoName: "name",
      },
      {
        key: "Owner Address  (if different from Operator)",
        pseudoName: "subsites",
      },
      {
        key: "National or Other ID number of owner(if different from Operator)",
        pseudoName: "id-of-mine-site-owner",
      },
    ],
  },
  {
    title: "Mine site location",
    data: [
      {
        key: "East UTM",
        pseudoName: "utm---east",
      },
      {
        key: "South UTM",
        pseudoName: "utm---south",
      },
      {
        key: "Degree-minute-second - East",
        pseudoName: "degree-minute-second---east",
      },
      {
        key: "Degree-minute-second - South",
        pseudoName: "degree-minute-second---south",
      },
      {
        key: "District",
        pseudoName: "district",
      },
      {
        key: "Sector",
        pseudoName: "sector",
      },
      {
        key: "Cell",
        pseudoName: "cell",
      },
    ],
  },
  {
    title: "Types of Minerals Produced",
    data: [
      {
        key: "Mined Minerals",
        pseudoName: "specify-order-of-economic-importance",
      },
    ],
  },
  {
    title: "Mine Lisence Information",
    data: [
      {
        key: "ICGLR Classification",
        pseudoName: "mine-site-classification",
      },
      {
        key: "Type of mineral license",
        pseudoName: "enter-permit-type",
      },
      {
        key: "License Number",
        pseudoName: "permit-number--ministerial-decree-no",
      },
      {
        key: "Issued Date",
        pseudoName: "date-issued",
      },
      {
        key: "Expiry Date",
        pseudoName: "expiry-date",
      },
      {
        key: "Surface Area (ha)",
        pseudoName: "surface-area-ha",
      },
    ],
  },
  {
    title: "Mine Production Details",
    data: [
      {
        key: "Type of Mine (open pit, underground, both)",
        pseudoName: "type-of-mine",
      },
      {
        key: "Mining Activity Status (Active, Non-Active, Abandoned)",
        pseudoName: "mine-activity-status",
      },
      {
        key: "Exploitation begun",
        pseudoName: "exploitation-begun",
      },
      {
        key: "Number of Workers (incl. Artisinal miners)",
        pseudoName: "all-mine-workers--f-m",
      },
      {
        key: "Average production per miner per day (kg)",
        pseudoName: "average-production-per-miner-per-day",
      },
      {
        key: "Number of Large open pit(s) - ACTIVE",
        pseudoName: "large-open-pit-active",
      },
      {
        key: "Number of Large open pit(s) - ABANDONED",
        pseudoName: "large-open-pit-abandoned",
      },
      {
        key: "Number of Small open pit(s) - ACTIVE",
        pseudoName: "small-open-pit-active",
      },
      {
        key: "Number of Small open pit(s) - ABANDONED",
        pseudoName: "small-open-pit-abandoned",
      },
      {
        key: "Number of Underground (tunnels) - ACTIVE",
        pseudoName: "underground-tunnels-active",
      },
      {
        key: "Number of Underground (tunnels) - ABANDONED",
        pseudoName: "underground-tunnels-abandoned",
      },
      {
        key: "Average / Representative Depth of Pit (m)",
        pseudoName: "typical-depth-of-pits-or-tunnels--m---special-range",
      },
      {
        key: "Mine Site Monthly Productive Capacity [t]",
        pseudoName: "monthly-capacity-specify-range",
      },
    ],
  },
  {
    title: "Production History",
    data: [
      {
        key: "Production History",
        pseudoName: "data-source",
      },
    ],
  },
  {
    title: "??",
    data: [
      {
        key: "The Current status of the minesite",
        pseudoName: "mine-site-certification-status--based-on-the-next-pages",
      },
      {
        key: "Date of last mine inspection",
        pseudoName: "date-of-last-inspection",
      },
      {
        key: "Next inspection date",
        pseudoName: "next-inspection-date",
      },
      {
        key: "Individual Responsible of last mine inspection",
        keyInAPI: "inspectorInfo.name",
      },
      {
        key: "Reference of Last Mine Inspection Report",
        pseudoName: "reference-of-last-inspection-report",
      },
      {
        key: "Inspection Comments",
        pseudoName: "main-problem-at-mine-site",
      },
    ],
  },
  {
    title: "Red Flag Information",
    data: [
      {
        key: "Non-State Armed Groups present in mine",
        pseudoName:
          "non-state-armed-groups-or-their-affiliates-illegally-control-mine-site",
      },
      {
        key: "Children present in mine",
        pseudoName:
          "children-below-the-minimum-working-age-as-defined-in-rwanda--16-years--are-employed-in-exploitation-at-the-mine-site",
      },
      {
        key: "Forced Labor at Mine",
        pseudoName: "forced-labor-is-practiced-on-the-mine-site",
      },
      {
        key: "Influx of Foreign Minerals",
        pseudoName:
          "security-staff-are-sensitized-to-prevent-report-influx-of-external-minerals-on-mine-sites",
      },
    ],
  },
  {
    title: "AFP",
    data: [
      {
        key: "Sampling took place (complete, partly, none)",
        pseudoName: "afp-sampling-has-already-taken-place",
      },
    ],
  },
  {
    title: "National mine site requirements",
    data: [
      {
        key: "PPE's available",
        pseudoName: "ppe-specify",
      },
      {
        key: "Safety at the operating site",
        pseudoName: "health---safety",
      },
      {
        key: "Environmental Status",
        pseudoName: "comments---action-15",
      },
      {
        key: "Wayforward/comment",
        pseudoName: "proposed-remedial-actions",
      },
    ],
  },
];
