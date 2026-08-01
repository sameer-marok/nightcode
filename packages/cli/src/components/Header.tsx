export function Header() {
    return (
        <box justifyContent="center" alignItems="center">
            <box
                flexDirection="row" // Arrange the content in a row
                justifyContent="center" // Center the content horizontally
                gap={0.5} // Add a gap of 0.5 units between the elements
                alignItems="center" // Center the content vertically
            >
                <ascii-font font="tiny" text="Night" color="gray" />
                <ascii-font font="tiny" text="Code" />
            </box>
        </box>
    );
}