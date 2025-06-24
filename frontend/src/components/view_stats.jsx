import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  CircularProgress,
  Chip,
  Pagination
} from "@heroui/react";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

import { getAllInterests } from "../services/statics_services/get_all_interests.js";
import { CheckIcon } from "lucide-react";
import { X } from "lucide-react";

import ViewButton from "./view_button.jsx";

export default function ViewStats({ triggerRefetch }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllInterests();
      setAllData(data);
      console.log("Data fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Refetch when triggerRefetch prop changes
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, triggerRefetch]);

  // Calculate pagination values
  const totalPages = Math.ceil(allData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Custom styling based on Leonardo.ai color scheme
  const styles = {
    modal: {
      backgroundColor: "#13112b",
      color: "#ffffff",
      fontFamily: "Poppins",
    },
    header: {
      backgroundColor: "#171533",
      color: "#ffffff",
      borderBottom: "1px solid #2e2852",
      fontFamily: "Poppins",
    },
    body: {
      backgroundColor: "#13112b",
      fontFamily: "Poppins",
    },
    footer: {
      backgroundColor: "#171533",
      borderTop: "1px solid #2e2852",
      fontFamily: "Poppins",
    },
    table: {
      backgroundColor: "#0d0c1d",
      color: "#ffffff",
      fontFamily: "Poppins",
    },
    tableHeader: {
      backgroundColor: "#171533",
      color: "#a88bff",
      borderBottom: "1px solid #2e2852",
      fontFamily: "Poppins",
    },
    button: {
      backgroundColor: "#7b5cf5",
      color: "#ffffff",
      fontFamily: "Poppins",
    },
    closeButton: {
      backgroundColor: "#553dbf",
      color: "#ffffff",
      fontFamily: "Poppins",
    },
  };

  return (
    <>
      <Button
        onPress={onOpen}
        size="sm"
        className="bg-purple-600 text-white hover:bg-purple-700"
      >
        Analytics
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="full"
        className="font-poppins"
      >
        <ModalContent style={styles.modal}>
          {(onClose) => (
            <>
              <ModalHeader
                className="flex flex-col gap-1 font-poppins"
                style={styles.header}
              >
                Recruiter Interaction Analytics
              </ModalHeader>

              <ModalBody>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <CircularProgress
                      color="secondary"
                      size="lg"
                      aria-label="Loading data"
                    />
                  </div>
                ) : (
                  <>
                    <Table
                      aria-label="Recruiter Stats Table"
                      className="font-poppins"
                    >
                      <TableHeader>
                        <TableColumn>USER</TableColumn>
                        <TableColumn>EMAIL</TableColumn>
                        <TableColumn>ENGAGEMENT LEVEL</TableColumn>
                        <TableColumn>SUMMARY</TableColumn>
                        <TableColumn>OBJECTIONS</TableColumn>
                        <TableColumn>FOLLOW UP</TableColumn>
                      </TableHeader>

                      <TableBody
                        emptyContent={"No data to display"}
                        className="font-poppins"
                      >
                        {currentItems.map((item) => (
                          <TableRow key={item._id} className="text-black">
                            <TableCell>{item.userName || "N/A"}</TableCell>
                            <TableCell>{item.email || "N/A"}</TableCell>
                            <TableCell>
                              <CircularProgress
                                aria-label="Interest percentage"
                                showValueLabel={true}
                                size="lg"
                                value={item.engagementPercentage || 0}
                                color={
                                  item.engagementPercentage > 80
                                    ? "secondary"
                                    : item.engagementPercentage > 60
                                      ? "success"
                                      : item.engagementPercentage > 40
                                        ? "warning"
                                        : item.engagementPercentage > 20
                                          ? "danger"
                                          : "danger"
                                }
                                classNames={{
                                  value: "text-black",
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <ViewButton
                                contents={item.summary || "N/A"}
                                buttonName="View"
                                Title="Summary"
                              />
                            </TableCell>
                            <TableCell>
                              {item.objections ? (
                                <ViewButton
                                  contents={item.objections || "N/A"}
                                  buttonName="View"
                                  Title="Reasons for No Match"
                                />
                              ) : (
                                <p className="text-gray-500">N/A</p>
                              )}
                            </TableCell>
                            <TableCell>
                              {item.followupSent ? (
                                <Chip
                                  size="sm"
                                  color="success"
                                  variant="faded"
                                  startContent={<CheckIcon size={18} />}
                                >
                                  Sent
                                </Chip>
                              ) : (
                                <Chip color="danger" variant="faded" startContent={<X size={18} />} size="sm">
                                  Not Sent
                                </Chip>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-4">
                      <Pagination
                        total={totalPages}
                        initialPage={1}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="secondary"
                        size="lg"
                        showControls
                        className="font-poppins"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                      <div>
                        Showing {startIndex + 1} to {Math.min(endIndex, allData.length)} of {allData.length} entries
                      </div>
                      <div>
                        Page {currentPage} of {totalPages}
                      </div>
                    </div>
                  </>
                )}
              </ModalBody>

              <ModalFooter style={styles.footer}>
                <Button
                  className="bg-purple-700 text-white hover:bg-purple-800"
                  variant="light"
                  onPress={() => {
                    fetchData(); // Manually refresh data
                    setCurrentPage(1); // Reset to first page when refreshing
                  }}
                >
                  Refresh Data
                </Button>
                <Button
                  className="bg-gray-700 text-white hover:bg-gray-800 ml-2"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}