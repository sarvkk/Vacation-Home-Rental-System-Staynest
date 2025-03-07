import { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Breadcrumb from "../../components/ui/BreadCrumb/BreadCrumb";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { FolderLock, Eye, FileCog } from "lucide-react";
import "./PersonalInfo.css";

export default function PersonalInfo() {
  const [editClicked, setEditClicked] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    zipcode: false,
    emergencyContact: false,
  });

  function handleClick(triggeredField) {
    setEditClicked((prevStates) => ({
      ...prevStates,
      [triggeredField]: !prevStates[triggeredField],
    }));
  }

  const [userData, setUserData] = useState({
    userName: "",
    userEmail: "",
    userPhoneNumber: "",
    userAddress: "",
    userZipCode: "",
    userEmergencyContact: "",
  });

  const [newUserData, setNewUserData] = useState({
    newUserName: "",
    newUserEmail: "",
    newUserPhoneNumber: "",
    newUserAddress: "",
    newUserZipCode: "",
    newUserEmergencyContact: "",
  });
  const getUserData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/account", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    try {
      if (!response.ok) {
        const errorResult = await response.json();
        toast.error(errorResult);
        return;
      }
      const data = await response.json();
      setUserData({
        userName: data.username,
        userEmail: data.email,
        userPhoneNumber: data.phoneNumber,
        userAddress: data.address,
        userZipCode: data.zipCode,
        userEmergencyContact: data.emergencyContact,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSave = async (fieldName) => {
    console.log(fieldName);
    const token = localStorage.getItem("token");

    const updatedField = {
      username: userData.userName,
      email: userData.userEmail,
      phoneNumber: userData.userPhoneNumber,
      address: userData.userAddress,
      zipCode: userData.userZipCode,
      emergencyContact: userData.userEmergencyContact,
    };

    if (newUserData.newUserName)
      updatedField.username = newUserData.newUserName;
    if (newUserData.newUserEmail) updatedField.email = newUserData.newUserEmail;
    if (newUserData.newUserPhoneNumber)
      updatedField.phoneNumber = newUserData.newUserPhoneNumber;
    if (newUserData.newUserAddress)
      updatedField.address = newUserData.newUserAddress;
    if (newUserData.newUserZipCode)
      updatedField.zipCode = newUserData.newUserZipCode;
    if (newUserData.newUserEmergencyContact)
      updatedField.emergencyContact = newUserData.newUserEmergencyContact;

    const response = await fetch(`http://localhost:3000/account/update`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedField),
    });
    try {
      if (!response.ok) {
        const result = await response.json();
        toast.error(result.message);
      } else {
        const result = await response.json();
        // setEditClicked((prev) => ({ ...prev, [fieldName]: false }));
        toast.success(result.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Header showPropertyOptions={false} showSearch={false} />
      <section className="personal-info-container">
        <Breadcrumb />
        <div className="personal-info-header">
          <h1>Personal Info</h1>
        </div>
        <div className="personal-info-component-container">
          <div className="personal-info">
            <div className="personal-info-item personal-info-item-1">
              <div className="personal-data">
                <h3>Profile name</h3>
                {editClicked.name ? (
                  <>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      sx={{
                        width: "400px",
                        height: "40px",
                        "& .MuiInputBase-root": {
                          height: "40px",
                          marginTop: "10px",
                        },
                        "& .MuiInputLabel-root": {
                          top: "-6px",
                          marginTop: "8px",
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: ".6rem",
                        },
                      }}
                      value={newUserData.newUserName}
                      onChange={(e) =>
                        setNewUserData((prevValue) => ({
                          ...prevValue,
                          newUserName: e.target.value,
                        }))
                      }
                    />
                    <button onClick={() => handleSave("username")}>Save</button>
                  </>
                ) : (
                  <span className="account-user-name">
                    {userData.userName ? userData.userName : "Not Provided"}
                  </span>
                )}
              </div>
              <div className="edit-personal-data">
                <button onClick={() => handleClick("name")}>
                  {editClicked.name ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
            <div className="personal-info-item personal-info-item-2">
              <div className="personal-data">
                <h3>Email address</h3>
                {editClicked.email ? (
                  <>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      value={newUserData.newUserEmail}
                      onChange={(e) =>
                        setNewUserData((prevValue) => ({
                          ...prevValue,
                          newUserEmail: e.target.value,
                        }))
                      }
                      sx={{
                        width: "400px",
                        height: "40px",
                        "& .MuiInputBase-root": {
                          height: "40px",
                          marginTop: "10px",
                        },
                        "& .MuiInputLabel-root": {
                          top: "-6px",
                          marginTop: "8px",
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: ".6rem",
                        },
                      }}
                    />
                    <button onClick={() => handleSave("email")}>Save</button>
                  </>
                ) : (
                  <span>
                    {userData.userEmail ? userData.userEmail : "Not Provided"}
                  </span>
                )}
              </div>
              <div className="edit-personal-data">
                <button onClick={() => handleClick("email")}>
                  {editClicked.email ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
            <div className="personal-info-item personal-info-item-3">
              <div className="personal-data">
                <h3>Phone number</h3>
                {editClicked.phone ? (
                  <>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      sx={{
                        width: "400px",
                        height: "40px",
                        "& .MuiInputBase-root": {
                          height: "40px",
                          marginTop: "10px",
                        },
                        "& .MuiInputLabel-root": {
                          top: "-6px",
                          marginTop: "8px",
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: ".6rem",
                        },
                      }}
                      value={newUserData.newUserPhoneNumber}
                      onChange={(e) =>
                        setNewUserData((prevValue) => ({
                          ...prevValue,
                          newUserPhoneNumber: e.target.value,
                        }))
                      }
                    />
                    <button onClick={() => handleSave("phoneNumber")}>
                      Save
                    </button>
                  </>
                ) : (
                  <span>
                    {userData.userPhoneNumber
                      ? userData.userPhoneNumber
                      : "Not provided"}
                  </span>
                )}
              </div>
              <div className="edit-personal-data">
                <button onClick={() => handleClick("phone")}>
                  {editClicked.phone ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
            <div className="personal-info-item personal-info-item-4">
              <div className="personal-data">
                <h3>Address</h3>
                {editClicked.address ? (
                  <>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      sx={{
                        width: "400px",
                        height: "40px",
                        "& .MuiInputBase-root": {
                          height: "40px",
                          marginTop: "10px",
                        },
                        "& .MuiInputLabel-root": {
                          top: "-6px",
                          marginTop: "8px",
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: ".6rem",
                        },
                      }}
                      value={newUserData.newUserAddress}
                      onChange={(e) =>
                        setNewUserData((prevValue) => ({
                          ...prevValue,
                          newUserAddress: e.target.value,
                        }))
                      }
                    />
                    <button onClick={() => handleSave("address")}>Save</button>
                  </>
                ) : (
                  <span>
                    {userData.userAddress
                      ? userData.userAddress
                      : "Not provided"}
                  </span>
                )}
              </div>
              <div className="edit-personal-data">
                <button onClick={() => handleClick("address")}>
                  {editClicked.address ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
            <div className="personal-info-item personal-info-item-5">
              <div className="personal-data">
                <h3>Zipcode</h3>
                {editClicked.zipcode ? (
                  <>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      sx={{
                        width: "400px",
                        height: "40px",
                        "& .MuiInputBase-root": {
                          height: "40px",
                          marginTop: "10px",
                        },
                        "& .MuiInputLabel-root": {
                          top: "-6px",
                          marginTop: "8px",
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: ".6rem",
                        },
                      }}
                      value={newUserData.newUserZipCode}
                      onChange={(e) =>
                        setNewUserData((prevValue) => ({
                          ...prevValue,
                          newUserZipCode: e.target.value,
                        }))
                      }
                    />
                    <button onClick={() => handleSave("zipcode")}>Save</button>
                  </>
                ) : (
                  <span>
                    {userData.userZipCode
                      ? userData.userZipCode
                      : "Not provided"}
                  </span>
                )}
              </div>
              <div className="edit-personal-data">
                <button onClick={() => handleClick("zipcode")}>
                  {editClicked.address ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
            <div className="personal-info-item personal-info-item-6">
              <div className="personal-data">
                <h3>Emergency contact</h3>
                {editClicked.emergencyContact ? (
                  <>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      sx={{
                        width: "400px",
                        height: "40px",
                        "& .MuiInputBase-root": {
                          height: "40px",
                          marginTop: "10px",
                        },
                        "& .MuiInputLabel-root": {
                          top: "-6px",
                          marginTop: "8px",
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: ".6rem",
                        },
                      }}
                      value={newUserData.newUse}
                      onChange={(e) =>
                        setNewUserData((prevValue) => ({
                          ...prevValue,
                          newUserEmergencyContact: e.target.value,
                        }))
                      }
                    />
                    <button onClick={() => handleSave("emergencyContact")}>
                      Save
                    </button>
                  </>
                ) : (
                  <span>
                    {userData.userEmergencyContact
                      ? userData.userEmergencyContact
                      : "Not Provided"}
                  </span>
                )}
              </div>
              <div className="edit-personal-data">
                <button onClick={() => handleClick("emergencyContact")}>
                  {editClicked.emergencyContact ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
          </div>
          <div className="personal-info-about">
            <div className="personal-info-about-data personal-info-about-data-item-1">
              <FolderLock size={50} strokeWidth={1.2} color="green" />
              <h1>Why isn&apos;t my info shown</h1>
              <p>We’re hiding some account details to protect your identity.</p>
            </div>
            <div className="personal-info-about-data personal-info-about-data-item-2">
              <FileCog size={50} strokeWidth={1.2} color="green" />
              <h1>Which details can be edited?</h1>
              <p>
                Contact info and personal details can be edited. If this info
                was used to verify your identity, you’ll need to get verified
                again the next time you book—or to continue hosting.
              </p>
            </div>
            <div className="personal-info-about-data personal-info-about-data-item-3">
              <Eye size={50} strokeWidth={1.2} color="green" />
              <h1>What info is shared with others?</h1>
              <p>
                Staynest only releases contact information for Hosts and guests
                after a reservation is confirmed.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
