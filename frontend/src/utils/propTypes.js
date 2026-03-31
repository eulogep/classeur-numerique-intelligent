/**
 * PropTypes centralisés pour tous les composants
 * Évite la duplication et assure la cohérence
 */

import PropTypes from 'prop-types';

// ─── TYPES DE BASE ───

export const folderShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
});

export const documentShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.number,
  folderId: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  addedAt: PropTypes.string,
  updatedAt: PropTypes.string,
  isFavorite: PropTypes.bool
});

// ─── PROPS COURANTES ───

export const buttonProps = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export const cardProps = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export const modalProps = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired
};

export const formGroupProps = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export const inputProps = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool
};

export const alertProps = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func
};

export const listProps = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderItem: PropTypes.func.isRequired,
  className: PropTypes.string
};

export const gridProps = {
  columns: PropTypes.number,
  gap: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export const badgeProps = {
  variant: PropTypes.oneOf(['primary', 'success', 'error']),
  children: PropTypes.node.isRequired
};

export const spinnerProps = {
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export const progressBarProps = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  showLabel: PropTypes.bool
};

export const tabsProps = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    content: PropTypes.node.isRequired
  })).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
};

export const tooltipProps = {
  content: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom'])
};

export const skeletonProps = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string
};

// ─── PROPS POUR LES COMPOSANTS MÉTIER ───

export const folderTreeProps = {
  folders: PropTypes.arrayOf(folderShape).isRequired,
  selectedFolderId: PropTypes.string,
  onSelectFolder: PropTypes.func.isRequired,
  onCreateFolder: PropTypes.func,
  onRenameFolder: PropTypes.func,
  onDeleteFolder: PropTypes.func
};

export const documentGalleryProps = {
  documents: PropTypes.arrayOf(documentShape).isRequired,
  folderId: PropTypes.string,
  onSelectDocument: PropTypes.func,
  onDeleteDocument: PropTypes.func,
  onDownloadDocument: PropTypes.func,
  viewMode: PropTypes.oneOf(['grid', 'list'])
};

export const dashboardProps = {
  folders: PropTypes.arrayOf(folderShape).isRequired,
  documents: PropTypes.arrayOf(documentShape).isRequired,
  statistics: PropTypes.shape({
    totalFolders: PropTypes.number,
    totalDocuments: PropTypes.number,
    totalSize: PropTypes.number,
    typeDistribution: PropTypes.object
  })
};

export const searchProps = {
  onResultsChange: PropTypes.func,
  onClose: PropTypes.func,
  placeholder: PropTypes.string
};

export const documentImportProps = {
  folderId: PropTypes.string.isRequired,
  onImportComplete: PropTypes.func,
  maxFileSize: PropTypes.number,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string)
};

// ─── HELPERS ───

/**
 * Applique les PropTypes à un composant
 */
export const applyPropTypes = (Component, props) => {
  Component.propTypes = props;
};

/**
 * Crée un PropTypes personnalisé
 */
export const createCustomPropType = (validator) => {
  return (props, propName, componentName) => {
    if (!validator(props[propName])) {
      return new Error(
        `Invalid prop \`${propName}\` of value \`${props[propName]}\` supplied to \`${componentName}\`.`
      );
    }
  };
};

export default {
  folderShape,
  documentShape,
  buttonProps,
  cardProps,
  modalProps,
  formGroupProps,
  inputProps,
  alertProps,
  listProps,
  gridProps,
  badgeProps,
  spinnerProps,
  progressBarProps,
  tabsProps,
  tooltipProps,
  skeletonProps,
  folderTreeProps,
  documentGalleryProps,
  dashboardProps,
  searchProps,
  documentImportProps,
  applyPropTypes,
  createCustomPropType
};
