import React, { useState } from "react";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/Button/Button";
import Badge, { type BadgeColor } from "@/components/Badge/Badge";
import Modal, { type ModalSize } from "@/components/Modal/Modal";
import Snackbar, {
  type SnackbarVariant,
  type SnackbarPosition,
} from "@/components/Snackbar/Snackbar";
import Select, { type SelectSize, type SelectOption } from "@/components/Select/Select";
import "./showcase.scss";

const buttonVariants: ButtonVariant[] = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "blue",
  "indigo",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "white",
  "black",
  "gray",
];
const buttonSizes: ButtonSize[] = ["sm", "md", "lg"];
const badgeColors: BadgeColor[] = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "blue",
  "indigo",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "white",
  "black",
  "gray",
];

/**
 * Component showcase page displaying all available button variants/sizes and badge colors.
 * Useful for design system review and component documentation.
 */
const modalSizes: ModalSize[] = ["sm", "md", "lg", "xl"];
const snackbarVariants: SnackbarVariant[] = ["info", "success", "warning", "danger"];
const snackbarPositions: SnackbarPosition[] = ["top-right", "bottom-right"];
const selectSizes: SelectSize[] = ["sm", "md", "lg"];
const selectDemoOptions: SelectOption[] = [
  { value: "opt1", label: "Option 1" },
  { value: "opt2", label: "Option 2" },
  { value: "opt3", label: "Option 3" },
];

export const ComponentShowcasePage: React.FC = () => {
  const [openModal, setOpenModal] = useState<ModalSize | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarConfig, setSnackbarConfig] = useState<{ variant: SnackbarVariant; position: SnackbarPosition }>({
    variant: "info",
    position: "top-right",
  });

  const openSnackbar = (variant: SnackbarVariant, position: SnackbarPosition) => {
    setSnackbarConfig({ variant, position });
    setSnackbarOpen(true);
  };

  return (
    <div className="showcase-container">
      <div className="showcase-header">
        <h1>Component Showcase</h1>
        <p className="showcase-subtitle">
          Preview of all available button variants, sizes, badge colors, modal sizes, snackbar variants/positions, and select sizes. 
        </p>
        <p className="showcase-subtitle">
          Useful for design system review and documentation.
        </p>
      </div>

      {/* Buttons Section */}
      <section className="showcase-section">
        <h2>Buttons</h2>

        {/* Button Variants */}
        <div className="showcase-subsection">
          <h3>Variants</h3>
          <div className="showcase-grid">
            {buttonVariants.map((variant) => (
              <div key={variant} className="showcase-item">
                <div className="item-label">{variant}</div>
                <Button variant={variant}>Button</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Button Sizes */}
        <div className="showcase-subsection">
          <h3>Sizes</h3>
          <div className="showcase-grid">
            {buttonSizes.map((size) => (
              <div key={size} className="showcase-item">
                <div className="item-label">{size}</div>
                <Button size={size}>Button</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Button States */}
        <div className="showcase-subsection">
          <h3>States</h3>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="item-label">Enabled (primary)</div>
              <Button variant="primary">Click me</Button>
            </div>
            <div className="showcase-item">
              <div className="item-label">Disabled (primary)</div>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
            <div className="showcase-item">
              <div className="item-label">Full Width (primary)</div>
              <Button variant="primary" fullWidth>
                Full Width
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="showcase-section">
        <h2>Badges</h2>

        {/* Badge Colors */}
        <div className="showcase-subsection">
          <h3>Colors</h3>
          <div className="showcase-grid">
            {badgeColors.map((color) => (
              <div key={color} className="showcase-item">
                <div className="item-label">{color}</div>
                <Badge color={color}>Badge</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Badge Variations */}
        <div className="showcase-subsection">
          <h3>Examples</h3>
          <div className="showcase-grid">
            <div className="showcase-item">
              <Badge color="primary">New</Badge>
            </div>
            <div className="showcase-item">
              <Badge color="success">Active</Badge>
            </div>
            <div className="showcase-item">
              <Badge color="warning">Pending</Badge>
            </div>
            <div className="showcase-item">
              <Badge color="danger">Error</Badge>
            </div>
            <div className="showcase-item">
              <Badge color="info">Info</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Section */}
      <section className="showcase-section">
        <h2>Modal</h2>

        <div className="showcase-subsection">
          <h3>Sizes</h3>
          <div className="showcase-grid">
            {modalSizes.map((size) => (
              <div key={size} className="showcase-item">
                <div className="item-label">{size}</div>
                <Button variant="primary" size="sm" onClick={() => setOpenModal(size)}>
                  Open {size}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {modalSizes.map((size) => (
          <Modal
            key={size}
            open={openModal === size}
            title={`Modal — ${size}`}
            size={size}
            onClose={() => setOpenModal(null)}
            actions={
              <Button variant="primary" size="sm" onClick={() => setOpenModal(null)}>
                Close
              </Button>
            }
          >
            <p>This is a <strong>{size}</strong> modal. Click outside or press Close to dismiss.</p>
          </Modal>
        ))}
      </section>

      {/* Snackbar Section */}
      <section className="showcase-section">
        <h2>Snackbar</h2>

        <div className="showcase-subsection">
          <h3>Variants (top-right)</h3>
          <div className="showcase-grid">
            {snackbarVariants.map((variant) => (
              <div key={variant} className="showcase-item">
                <div className="item-label">{variant}</div>
                <Button
                  variant={variant}
                  size="sm"
                  onClick={() => openSnackbar(variant, "top-right")}
                >
                  Show
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="showcase-subsection">
          <h3>Positions</h3>
          <div className="showcase-grid">
            {snackbarPositions.map((position) => (
              <div key={position} className="showcase-item">
                <div className="item-label">{position}</div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openSnackbar("info", position)}
                >
                  Show
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Snackbar
          open={snackbarOpen}
          message={`${snackbarConfig.variant} — ${snackbarConfig.position}`}
          variant={snackbarConfig.variant}
          position={snackbarConfig.position}
          onClose={() => setSnackbarOpen(false)}
        />
      </section>

      {/* Select Section */}
      <section className="showcase-section">
        <h2>Select</h2>

        <div className="showcase-subsection">
          <h3>Sizes</h3>
          <div className="showcase-grid">
            {selectSizes.map((size) => (
              <div key={size} className="showcase-item">
                <div className="item-label">{size}</div>
                <Select options={selectDemoOptions} size={size} />
              </div>
            ))}
          </div>
        </div>

        <div className="showcase-subsection">
          <h3>Full Width</h3>
          <Select options={selectDemoOptions} fullWidth />
        </div>
      </section>
    </div>
  );
};

export default ComponentShowcasePage;
