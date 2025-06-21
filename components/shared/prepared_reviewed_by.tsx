import React from "react";
import {
  UserCheck,
  UserCog,
  Mail,
  CalendarDays,
  LucideIcon,
  User,
} from "lucide-react";
import { Label } from "../ui/label";
import Link from "next/link";

interface PersonInfo {
  name?: string;
  email?: string;
  date_issued?: string; // ISO format recommended
}

interface PreparedReviewedByProps {
  preparedBy?: PersonInfo;
  reviewedBy?: PersonInfo;
}

interface UserDetailProps extends PersonInfo {
  icon: LucideIcon;
  title: string;
}

const UserDetail: React.FC<UserDetailProps> = ({
  icon: Icon,
  title,
  name,
  email,
  date_issued,
}) => {
  return (
    <div className="border border-neutral-800 flex flex-col items-start space-x-4 rounded-md shadow-md p-5 w-full md:w-1/2">
      <div className="text-black mt-1">
        <Icon size={24} />
      </div>
      <div className="flex-1 flex flex-col mt-2">
        <Label className="font-helvetica-14 mb-1">{title}</Label>
        <div className="flex items-center font-table mt-1">
          {name ? <User className="mr-1.5" size={16} strokeWidth={2} /> : null}
          <Label className="font-helvetica-13">{name}</Label>
        </div>
        <div className="flex items-center font-table mt-1">
          {email ? <Mail className="mr-1.5" size={16} strokeWidth={2} /> : null}
          <Link
            href={`mailto:${email}`}
            className="hover:underline font-helvetica-13">
            {email}
          </Link>
        </div>
        <Label className="flex items-center font-helvetica-13 mt-1">
          {email ? (
            <CalendarDays className="mr-1.5" size={16} strokeWidth={2} />
          ) : null}
          {date_issued
            ? new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(date_issued))
            : ""}
        </Label>
      </div>
    </div>
  );
};

const PreparedReviewedBy: React.FC<PreparedReviewedByProps> = ({
  preparedBy,
  reviewedBy,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-5">
      <UserDetail
        icon={UserCog}
        title="Prepared By"
        name={preparedBy?.name ?? ""}
        email={preparedBy?.email ?? ""}
        date_issued={preparedBy?.date_issued}
      />
      <UserDetail
        icon={UserCheck}
        title="Reviewed By"
        name={reviewedBy?.name ?? ""}
        email={reviewedBy?.email ?? ""}
        date_issued={reviewedBy?.date_issued}
      />
    </div>
  );
};

export default PreparedReviewedBy;
