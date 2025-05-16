import React from "react";
import {
  UserCheck,
  UserCog,
  Mail,
  CalendarDays,
  LucideIcon,
} from "lucide-react";

interface PersonInfo {
  name: string;
  email: string;
  date: string; // ISO format recommended
}

interface PreparedReviewedByProps {
  preparedBy: PersonInfo;
  reviewedBy: PersonInfo;
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
  date,
}) => {
  return (
    <div className="flex items-start space-x-4 bg-white rounded-md shadow-md p-5 w-full md:w-1/2">
      <div className="text-blue-600 mt-1">
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <div className="text-lg font-semibold text-gray-800 mb-1">{title}</div>
        <div className="text-gray-900 font-medium">{name}</div>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Mail className="mr-1.5" size={16} />
          <a href={`mailto:${email}`} className="hover:underline">
            {email}
          </a>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <CalendarDays className="mr-1.5" size={16} />
          {new Date(date).toLocaleDateString()}
        </div>
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
        name={preparedBy.name}
        email={preparedBy.email}
        date={preparedBy.date}
      />
      <UserDetail
        icon={UserCheck}
        title="Reviewed By"
        name={reviewedBy.name}
        email={reviewedBy.email}
        date={reviewedBy.date}
      />
    </div>
  );
};

export default PreparedReviewedBy;
