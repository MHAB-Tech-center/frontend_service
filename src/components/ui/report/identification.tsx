import React, { useEffect } from "react";
import { ComplexInput } from "../Input";
import { Label } from "../base/label";

interface IdentificationTabProps {
  identification: {
    mineOwner: string;
    mineOperator: string;
    licenseNumber: string | null;
    mainBuyers: string;
    licenseCategory: string;
    licenseIssueDate: string;
    licenseExpirationDate: string;
    province: string;
    district: string;
    sector: string;
    cell: string;
    coordinates: {
      utm_east: string;
      utm_south: string;
      dms_east: string;
      dms_south: string;
    };
    responsiblePersonNames: string;
    responsiblePersonTitle: string;
    responsiblePersonContact: string;
    id: string;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
  };
}

const IdentificationTab = (props: IdentificationTabProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = React.useState<any>({});
  useEffect(() => {
    setData(props.identification);
  }, [props]);
  return (
    <div className="py-5 flex flex-col gap-6">
      <div className="title bg-primary-100 text-black p-4 rounded-md font-bold">
        <h2>Identification of Mine and Inspector</h2>
      </div>

      <form className="flex flex-col gap-4 px-4">
        <ComplexInput
          disabled
          id="mine-owner-name"
          label="Name Of Mine Owner"
          type="text"
          placeholder="Enter Name Of Mine Owner"
          value={data.mineOwner}
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
        />
        <ComplexInput
          disabled
          id="mine-operator-name"
          label="Name Of Mine Operator"
          type="text"
          placeholder="Enter Name Of Mine Operator"
          value={data.mineOperator}
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
        />
        <ComplexInput
          disabled
          id="mine-site-name"
          label="Name Of The Mine Site/Perimeter"
          type="text"
          placeholder="Enter Name Of The Mine Site/Perimeter"
          value={data.licenseNumber}
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
        />
        <ComplexInput
          disabled
          id="sub-sites-name"
          label="Name Of Sub-Sites"
          type="text"
          placeholder="Enter Name Of Sub-Sites"
          value={data.mainBuyers}
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
        />
        <ComplexInput
          disabled
          id="license-number"
          label="License Number"
          type="text"
          placeholder="Enter License Number"
          value={data.licenseNumber}
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
        />
        <ComplexInput
          disabled
          id="mine-site-number"
          label="Mine Site Number"
          type="text"
          placeholder="Enter Mine Site Number"
          value={data.licenseCategory}
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
        />
        <ComplexInput
          disabled
          id="main-buyer"
          label="Main Buyer Of Minerals From The Mine Site"
          type="text"
          placeholder="Enter Main Buyer Of Minerals From The Mine Site"
          value={data.mainBuyers}
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
        />

        <Label>Type of License</Label>
        <ComplexInput
          disabled
          id="license-category"
          label="Category"
          type="text"
          placeholder="Category of License"
          value={data.licenseCategory}
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
        />
        <div className="flex flex-col md:flex-row gap-4">
          <ComplexInput
            disabled
            id="issued-on"
            label="Issued On"
            type="date"
            placeholder="Enter Issued Date"
            value={data.licenseIssueDate}
            className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
          />
          <ComplexInput
            disabled
            id="expired-date"
            label="Expired Date"
            type="date"
            placeholder="Enter Expired Date"
            value={data.licenseExpirationDate}
            className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
          />
        </div>
        <Label>Location</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComplexInput
            disabled
            id="province"
            label="Province"
            type="text"
            placeholder="Enter Province"
            value={data.province}
            className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
          />
          <ComplexInput
            disabled
            id="district"
            label="District"
            type="text"
            placeholder="Enter District"
            value={data.district}
            className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
          />
          <ComplexInput
            disabled
            id="sector"
            label="Sector"
            type="text"
            placeholder="Enter Sector"
            value={data.sector}
            className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
          />
          <ComplexInput
            disabled
            id="cell"
            label="Cell"
            type="text"
            placeholder="Enter Cell"
            value={data.cell}
            className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
          />
        </div>
        <Label>Coordinates</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComplexInput
            disabled
            id="utm-east"
            label="UTM East"
            type="text"
            placeholder="Enter UTM East"
            value={data.coordinates?.utm_east}
            className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
          />
          <ComplexInput
            disabled
            id="utm-south"
            label="UTM South"
            type="text"
            placeholder="Enter UTM South"
            value={data.coordinates?.utm_south}
            className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
          />
          <ComplexInput
            disabled
            id="dms-east"
            label="DMS East"
            type="text"
            placeholder="Enter DMS East"
            value={data.coordinates?.dms_east}
            className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
          />
          <ComplexInput
            disabled
            id="dms-south"
            label="DMS South"
            type="text"
            placeholder="Enter DMS South"
            value={data.coordinates?.dms_south}
            className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
          />
        </div>
        <Label>Responsible Person</Label>
        <ComplexInput
          disabled
          id="responsible-person-name"
          label="Name"
          type="text"
          placeholder="Enter Name of Responsible Person"
          value={data.responsiblePersonNames}
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
        />
        <ComplexInput
          disabled
          id="responsible-person-title"
          label="Title"
          type="text"
          placeholder="Enter Title of Responsible Person"
          value={data.responsiblePersonTitle}
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
        />
        <ComplexInput
          disabled
          id="responsible-person-phone"
          label="Contact number"
          type="text"
          placeholder="Enter Contact number of Responsible Person"
          value={data.responsiblePersonContact}
          className="border-y-0 border-r-0 border-l-2 border-l-primary-600 bg-primary-50"
        />
      </form>
    </div>
  );
};

export default IdentificationTab;
