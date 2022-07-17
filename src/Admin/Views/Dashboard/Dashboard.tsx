import React from "react";
import { Center, Flex } from "@chakra-ui/react";
import { MyContain } from "../../UI/Components/MyContain";
import { ReportBar } from "./ReportBar";
import { ReportLine } from "./ReportLine";
import ReportStatsCards from "./ReportStatsCards";
import ReportPie from "./ReportPie";

export const DashboardView = () => {
  return (
    <>
      <MyContain>
        <Center margin={5}>
          <ReportStatsCards />
        </Center>
      </MyContain>
      <br />
      <MyContain>
        <ReportLine />
      </MyContain>
      <br />
      <MyContain>
        <Flex direction={{sm: "column", md: "column", lg: "column", xl:"row" }}>
          <ReportBar />
          <ReportPie />
        </Flex>
      </MyContain>
    </>
  );
};
