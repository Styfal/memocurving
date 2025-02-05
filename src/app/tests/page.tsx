"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import TestCourse from "@/components/testcourse"; // Ensure the exported component is named appropriately

const Page = () => {
  return (
    <MaxWidthWrapper>
      <TestCourse />
    </MaxWidthWrapper>
  );
};

export default Page;
