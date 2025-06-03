import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Form, Alert } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import Box from "../../components/Box";
import { useStore } from "../../store";
import { useStoreStore } from "../../zustand/storeStore";
import { useTranslation } from "react-i18next";
import { getSettingByStore, updateSettingByStore } from "../../services/setting";
import { useCountStore } from "../../zustand/countState";

export default function AudioSettingPage() {
  const { t } = useTranslation();

  // Fix: Properly initialize state
  const [audioSetting, setAudioSetting] = useState({
    order: false,
    openTable: false,
    message: false,
    music: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Load initial settings
  useEffect(() => {
    loadSettingByStore()
  }, [])

  // get setting by store
  const loadSettingByStore = async () => {
    const localData = JSON.parse(localStorage.getItem("storeDetail"));
    try {
      let _storeId = localData?.state?.storeDetail._id;
      const response = await getSettingByStore(_storeId)
      if (response) {
        setAudioSetting({
          order: response?.isOrderSound,
          openTable: response?.isTableSound,
          message: response?.isMessageSound,
          music: response?.isMusicSound,
        })
      }
    } catch (error) {
      console.log("get setting by store error:", error);
      setError("Failed to load settings. Please try again.");
    }
  }

  // Update setting by store id - using actual state values
  const updateStoreSettings = async (updatedSettings) => {
    const localData = JSON.parse(localStorage.getItem("storeDetail"));
    if (!localData?.state?.storeDetail._id) {
      setError("Store information not found");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await updateSettingByStore({
        storeId: localData?.state?.storeDetail._id,
        settings: {
          isOrderSound: updatedSettings.order,
          isTableSound: updatedSettings.openTable,
          isMusicSound: updatedSettings.music,
          isMessageSound: updatedSettings.message,
        }
      });

      if(result.status === 200) {
        useCountStore.getState().setCountNumber(useCountStore.getState().countNumber + 1);
        loadSettingByStore()
      }

    } catch (error) {
      console.error('Failed to update settings:', error);
      setError("Failed to update settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle setting change
  const handleSettingChange = (key, value) => {
    const newSettings = {
      ...audioSetting,
      [key]: value
    };
    setAudioSetting(newSettings);

    updateStoreSettings(newSettings); 
  };

  const settingsConfig = [
    {
      title: t("restaurant_sound"),
      items: [
        {
          title: t("has_order"),
          key: "order",
        },
        {
          title: t("oppen_tb_sound"),
          key: "openTable",
        }
      ]
    },
    {
      title: t("mg_sound"),
      items: [
        {
          title: t("mg_in_sound"),
          key: "message",
        }
      ]
    },
    {
      title: t("other_sound"),
      items: [
        {
          title: t("song_sound"),
          key: "music",
        }
      ]
    }
  ];

  return (
    <>
      <Box
        sx={{ padding: { md: 20, xs: 10 } }}
        style={{
          maxHeight: "100vh",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("sound_setting")}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Success/Error Messages */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" dismissible onClose={() => setSuccessMessage("")}>
            {successMessage}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr", xs: "1fr" },
            gap: 20,
            gridTemplateRows: "masonry",
          }}
        >
          {settingsConfig.map((section, sectionIndex) => (
            <Card key={sectionIndex} border="primary" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {section.title}
              </Card.Header>
              <Card.Body>
                {section.items.map((item, index) => (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: index < section.items.length - 1 ? `1px dotted ${COLOR_APP}` : "none",
                    }}
                    key={index}
                  >
                    <div>{item.title}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        justifyContent: "center",
                      }}
                    >
                      <Form.Label htmlFor={"switch-audio-" + item.key}>
                        {audioSetting[item.key] ? t("oppen") : t("close")}
                      </Form.Label>
                      <Form.Check
                        type="switch"
                        checked={audioSetting[item.key] || false}
                        id={"switch-audio-" + item.key}
                        disabled={isLoading && audioSetting[item.key] === item?.key}
                        onChange={(e) =>
                          handleSettingChange(item.key, e.target.checked)
                        }
                      />
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}
